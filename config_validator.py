#!/usr/bin/env python3
"""
Configuration Validation and Management System
Validates configuration files and environment variables
"""

import os
import sys
import json
import yaml
from pathlib import Path
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field


@dataclass
class ConfigSchema:
    """Schema definition for configuration validation"""
    name: str
    required_fields: List[str] = field(default_factory=list)
    optional_fields: List[str] = field(default_factory=list)
    field_types: Dict[str, type] = field(default_factory=dict)
    validators: Dict[str, callable] = field(default_factory=dict)


class ConfigValidator:
    """Configuration validation engine"""
    
    def __init__(self):
        self.schemas = self._load_schemas()
        self.errors = []
        self.warnings = []
    
    def _load_schemas(self) -> Dict[str, ConfigSchema]:
        """Load configuration schemas"""
        return {
            'nexus': ConfigSchema(
                name='nexus',
                required_fields=['version', 'environment'],
                optional_fields=['debug', 'log_level', 'cache_enabled'],
                field_types={
                    'version': str,
                    'environment': str,
                    'debug': bool,
                    'log_level': str,
                    'cache_enabled': bool
                }
            )
        }
    
    def validate_json(self, filepath: Path, schema_name: Optional[str] = None) -> bool:
        """Validate JSON configuration file"""
        try:
            with open(filepath, 'r') as f:
                config = json.load(f)
            
            if schema_name and schema_name in self.schemas:
                return self._validate_against_schema(config, self.schemas[schema_name])
            
            return True
        except json.JSONDecodeError as e:
            self.errors.append(f"Invalid JSON in {filepath}: {e}")
            return False
        except Exception as e:
            self.errors.append(f"Error reading {filepath}: {e}")
            return False
    
    def validate_yaml(self, filepath: Path, schema_name: Optional[str] = None) -> bool:
        """Validate YAML configuration file"""
        try:
            with open(filepath, 'r') as f:
                config = yaml.safe_load(f)
            
            if schema_name and schema_name in self.schemas:
                return self._validate_against_schema(config, self.schemas[schema_name])
            
            return True
        except yaml.YAMLError as e:
            self.errors.append(f"Invalid YAML in {filepath}: {e}")
            return False
        except Exception as e:
            self.errors.append(f"Error reading {filepath}: {e}")
            return False
    
    def _validate_against_schema(self, config: Dict[str, Any], schema: ConfigSchema) -> bool:
        """Validate configuration against schema"""
        valid = True
        
        # Check required fields
        for field in schema.required_fields:
            if field not in config:
                self.errors.append(f"Missing required field: {field}")
                valid = False
        
        # Check field types
        for field, value in config.items():
            if field in schema.field_types:
                expected_type = schema.field_types[field]
                if not isinstance(value, expected_type):
                    self.errors.append(
                        f"Invalid type for {field}: expected {expected_type.__name__}, got {type(value).__name__}"
                    )
                    valid = False
        
        # Run custom validators
        for field, validator in schema.validators.items():
            if field in config:
                try:
                    if not validator(config[field]):
                        self.errors.append(f"Validation failed for {field}")
                        valid = False
                except Exception as e:
                    self.errors.append(f"Validator error for {field}: {e}")
                    valid = False
        
        return valid
    
    def validate_env_vars(self, required_vars: List[str]) -> bool:
        """Validate required environment variables"""
        valid = True
        for var in required_vars:
            if var not in os.environ:
                self.errors.append(f"Missing required environment variable: {var}")
                valid = False
        return valid
    
    def print_report(self):
        """Print validation report"""
        if self.errors:
            print("❌ Validation Errors:")
            for error in self.errors:
                print(f"  • {error}")
        
        if self.warnings:
            print("\n⚠️  Warnings:")
            for warning in self.warnings:
                print(f"  • {warning}")
        
        if not self.errors and not self.warnings:
            print("✅ All validations passed!")


def main():
    """Main validation function"""
    validator = ConfigValidator()
    project_root = Path(__file__).parent
    
    # Validate configuration files
    config_files = [
        ('setup.cfg', None),
        ('docker-compose.yml', None),
    ]
    
    print("Validating configuration files...")
    all_valid = True
    
    for filename, schema in config_files:
        filepath = project_root / filename
        if filepath.exists():
            print(f"  Checking {filename}...", end=" ")
            if filename.endswith('.json'):
                valid = validator.validate_json(filepath, schema)
            elif filename.endswith(('.yml', '.yaml')):
                valid = validator.validate_yaml(filepath, schema)
            else:
                valid = True
            
            if valid:
                print("✅")
            else:
                print("❌")
                all_valid = False
        else:
            print(f"  {filename} not found (optional)")
    
    print()
    validator.print_report()
    
    return 0 if all_valid else 1


if __name__ == '__main__':
    try:
        import yaml
    except ImportError:
        print("Installing pyyaml...")
        os.system(f"{sys.executable} -m pip install pyyaml")
        import yaml
    
    sys.exit(main())
