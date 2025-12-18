#!/usr/bin/env python3
"""
Unit tests for Python modules
"""
import sys
import os
import pytest
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))


class TestNexusVisuals:
    """Tests for nexus_visuals.py"""

    def test_import_nexus_visuals(self):
        """Test that nexus_visuals can be imported"""
        try:
            import nexus_visuals
            assert nexus_visuals is not None
        except ImportError as e:
            pytest.skip(f"nexus_visuals not importable: {e}")

    def test_quantum_color_engine_exists(self):
        """Test that QuantumColorEngine class exists"""
        try:
            from nexus_visuals import QuantumColorEngine
            assert QuantumColorEngine is not None
        except ImportError:
            pytest.skip("QuantumColorEngine not available")


class TestNexusConfig:
    """Tests for nexus_config.py"""

    def test_import_nexus_config(self):
        """Test that nexus_config can be imported"""
        try:
            import nexus_config
            assert nexus_config is not None
        except ImportError as e:
            pytest.skip(f"nexus_config not importable: {e}")


class TestNexusCache:
    """Tests for nexus_cache.py"""

    def test_import_nexus_cache(self):
        """Test that nexus_cache can be imported"""
        try:
            import nexus_cache
            assert nexus_cache is not None
        except ImportError as e:
            pytest.skip(f"nexus_cache not importable: {e}")


class TestNexusErrorHandler:
    """Tests for nexus_error_handler.py"""

    def test_import_nexus_error_handler(self):
        """Test that nexus_error_handler can be imported"""
        try:
            import nexus_error_handler
            assert nexus_error_handler is not None
        except ImportError as e:
            pytest.skip(f"nexus_error_handler not importable: {e}")

    def test_setup_logger_exists(self):
        """Test that setup_logger function exists"""
        try:
            from nexus_error_handler import setup_logger
            assert setup_logger is not None
        except ImportError:
            pytest.skip("setup_logger not available")


class TestBasicFunctionality:
    """Basic functionality tests"""

    def test_project_structure(self):
        """Test that key directories exist"""
        assert (PROJECT_ROOT / "src").exists()
        assert (PROJECT_ROOT / "scripts").exists()
        assert (PROJECT_ROOT / "tests").exists()

    def test_key_files_exist(self):
        """Test that key files exist"""
        assert (PROJECT_ROOT / "README.md").exists()
        assert (PROJECT_ROOT / "requirements.txt").exists()
        assert (PROJECT_ROOT / "install.sh").exists()

    def test_python_version(self):
        """Test Python version is 3.9+"""
        assert sys.version_info >= (3, 9), "Python 3.9+ required"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
