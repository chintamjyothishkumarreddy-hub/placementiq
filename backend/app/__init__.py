import sys
import importlib.machinery

try:
    from importlib._bootstrap_external import FileFinder

    class FilteredExtensionLoader(importlib.machinery.ExtensionFileLoader):
        def create_module(self, spec):
            if spec and 'sqlalchemy' in spec.name:
                raise ImportError('Pure python fallback for sqlalchemy')
            return super().create_module(spec)

    hook = FileFinder.path_hook(
        (importlib.machinery.SourceFileLoader, importlib.machinery.SOURCE_SUFFIXES),
        (FilteredExtensionLoader, importlib.machinery.EXTENSION_SUFFIXES),
        (importlib.machinery.SourcelessFileLoader, importlib.machinery.BYTECODE_SUFFIXES),
    )
    sys.path_hooks = [hook]
    sys.path_importer_cache.clear()
except Exception:
    pass
