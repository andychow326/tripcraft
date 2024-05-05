"""create_plan_table

Revision ID: 84400330e2b9
Revises: c3ec78c03f0b
Create Date: 2024-05-04 19:13:44.820973

"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

from alembic import op
from tripcraft.constants import POSTGRES_SCHEMA

# revision identifiers, used by Alembic.
revision: str = "84400330e2b9"
down_revision: Union[str, None] = "c3ec78c03f0b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(sa.text(f"SET search_path TO {POSTGRES_SCHEMA}, public;"))

    op.create_table(
        "plan",
        sa.Column("id", sa.TEXT, primary_key=True),
        sa.Column("name", sa.TEXT, nullable=False),
        sa.Column("config", JSONB, nullable=False),
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
        sa.Column("public_role", sa.TEXT, nullable=False),
        sa.Column("public_visibility", sa.BOOLEAN, nullable=False),
        schema=POSTGRES_SCHEMA,
    )

    op.create_table(
        "plan_user",
        sa.Column("plan_id", sa.TEXT, sa.ForeignKey("plan.id"), primary_key=True),
        sa.Column("user_id", sa.TEXT, sa.ForeignKey("user.id"), primary_key=True),
        sa.Column("role", sa.TEXT, nullable=False),
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
    op.drop_table("plan_user", schema=POSTGRES_SCHEMA)
    op.drop_table("plan", schema=POSTGRES_SCHEMA)
