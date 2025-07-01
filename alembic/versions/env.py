"""
Alembic migration environment setup for brAInwav MAS Platform.
This script configures Alembic to use the project's SQLAlchemy models and database settings.
"""
# alembic/env.py

import logging
import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context

# --- Project Specific Imports ---
# Adjust the import path below to point to your SQLAlchemy declarative base.
# It's assumed your base class (e.g., Base = declarative_base()) is defined
# in apps/api/src/core/models/base.py
# You might need to add your project's root to the Python path if running Alembic
# from a different context (e.g., from the root of the monorepo).
# Add your project's `apps/api/src` directory to the Python path
# so that modules like `apps.api.src.core.models.base` can be found.
# For example, if alembic.ini is at the project root:
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(project_root, "apps", "api", "src"))

# Import your declarative Base from your application's models
try:
    from apps.api.src.core.models.base import (
        Base,  # Adjust if your Base is named differently or located elsewhere
    )

    target_metadata = Base.metadata
    logging.getLogger("alembic.env").info(
        "Successfully imported Base metadata from apps/api/src/core/models/base.py"
    )
except ImportError as e:
    logging.getLogger("alembic.env").error(
        f"ERROR: Could not import Base from apps.api.src.core.models.base. Please ensure the path is correct and your models are defined: {e}"
    )
    target_metadata = (
        None  # Set to None to prevent immediate failure, but migrations won't work correctly
    )


# --- Alembic Configuration Setup ---

# This is the Alembic Config object, which provides access to values
# within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers from the .ini file.
fileConfig(config.config_filepath(), disable_existing_loggers=False)
logger = logging.getLogger("alembic.env")

# Retrieve the database URL from environment variables.
# This makes Alembic connect to the same database your application uses.
# The 'DATABASE_URL' environment variable must be set (e.g., in your .env file).
# This overrides any `sqlalchemy.url` setting directly in alembic.ini,
# which is good practice for production environments.
db_url = os.environ.get("DATABASE_URL")
if db_url:
    config.set_main_option("sqlalchemy.url", db_url)
    logger.info(
        f"Using DATABASE_URL from environment: {db_url.split('//')[0]}://***@{db_url.split('@')[1]}"
    )  # Log without sensitive parts
else:
    logger.warning(
        "DATABASE_URL environment variable is not set. "
        "Alembic may not connect to the correct database. "
        "Ensure it's set for migrations."
    )
    # Fallback to a URL from alembic.ini if not in environment (less recommended)
    # or raise an error if a DB URL is strictly required.


# add your model's MetaData object here for 'autogenerate' support
# from your_app_name.models import Base
# target_metadata = Base.metadata
# For a project-specific setup, `target_metadata` should be imported from your models.
# It's already defined above from `core.models.base.Base.metadata`


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    too.  By skipping the Engine creation we don't even
    need a database to be available.

    Calls to context.execute() here emit the given string to the
    script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.

    In this scenario, we need to create an Engine
    and associate a connection with the context.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
