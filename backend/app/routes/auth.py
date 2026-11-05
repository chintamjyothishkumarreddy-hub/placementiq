from typing import Optional
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import LoginRequest, Token, UserOut, UserCreate
from app.auth import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    bio: Optional[str] = None
    avatar_type: Optional[str] = None
    avatar_value: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_data.username).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account is disabled")

    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "phone": user.phone,
            "department": user.department,
            "designation": user.designation,
            "bio": user.bio,
            "avatar_type": user.avatar_type,
            "avatar_value": user.avatar_value
        }
    }

@router.post("/register", response_model=Token)
@router.post("/signup", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user_in.username).first():
        raise HTTPException(status_code=400, detail="Username is already taken")
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email is already registered")

    user = User(
        username=user_in.username,
        email=user_in.email,
        full_name=user_in.full_name,
        role="viewer",  # Public signups are strictly granted viewer role
        is_active=True,
        hashed_password=get_password_hash(user_in.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "phone": user.phone,
            "department": user.department,
            "designation": user.designation,
            "bio": user.bio,
            "avatar_type": user.avatar_type,
            "avatar_value": user.avatar_value
        }
    }

@router.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
def update_current_user_profile(
    profile_data: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if profile_data.email and profile_data.email != current_user.email:
        existing = db.query(User).filter(User.email == profile_data.email, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email is already in use by another account")
        current_user.email = profile_data.email

    if profile_data.full_name is not None and profile_data.full_name.strip():
        current_user.full_name = profile_data.full_name.strip()

    if profile_data.phone is not None:
        current_user.phone = profile_data.phone.strip() if profile_data.phone.strip() else None

    if profile_data.department is not None:
        current_user.department = profile_data.department.strip() if profile_data.department.strip() else None

    if profile_data.designation is not None:
        current_user.designation = profile_data.designation.strip() if profile_data.designation.strip() else None

    if profile_data.bio is not None:
        current_user.bio = profile_data.bio.strip() if profile_data.bio.strip() else None

    if profile_data.avatar_type is not None:
        current_user.avatar_type = profile_data.avatar_type.strip()

    if profile_data.avatar_value is not None:
        current_user.avatar_value = profile_data.avatar_value.strip()

    if profile_data.new_password:
        if not profile_data.current_password or not verify_password(profile_data.current_password, current_user.hashed_password):
            raise HTTPException(status_code=400, detail="Current password verification failed")
        if len(profile_data.new_password) < 6:
            raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
        current_user.hashed_password = get_password_hash(profile_data.new_password)

    db.commit()
    db.refresh(current_user)
    return current_user
