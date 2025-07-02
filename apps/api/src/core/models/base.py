"""
Database base model for brAInwav API.
"""

from sqlalchemy.ext.declarative import declarative_base

# SQLAlchemy base for all models
Base = declarative_base()

# Database configuration will be added when needed
# For now, this provides the Base class that Alembic expects
