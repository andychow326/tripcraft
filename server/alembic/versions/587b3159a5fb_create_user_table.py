"""create user table

Revision ID: 587b3159a5fb
Revises: 
Create Date: 2024-04-28 20:46:29.741686

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op
from tripcraft.constants import POSTGRES_SCHEMA

# revision identifiers, used by Alembic.
revision: str = "587b3159a5fb"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            (
                "CREATE SCHEMA IF NOT EXISTS {schema_name};"
                "SET search_path TO {schema_name}, public;"
            ).format(schema_name=POSTGRES_SCHEMA)
        )
    )

    op.create_table(
        "user",
        sa.Column("id", sa.TEXT, primary_key=True),
        sa.Column("name", sa.TEXT, nullable=False),
        sa.Column("email", sa.TEXT, nullable=False, unique=True),
        sa.Column("is_valid", sa.BOOLEAN, nullable=False, default=False),
        sa.Column(
            "created_at",
            sa.DateTime,
            nullable=False,
            server_default=sa.func.timezone("UTC", sa.func.now()),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime,
            nullable=False,
            server_default=sa.func.timezone("UTC", sa.func.now()),
        ),
        schema=POSTGRES_SCHEMA,
    )


def downgrade() -> None:
    op.drop_table("user", schema=POSTGRES_SCHEMA)
