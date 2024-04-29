"""create auth table

Revision ID: 885f18ec1430
Revises: 587b3159a5fb
Create Date: 2024-04-28 20:52:05.655474

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op
from tripcraft.constants import POSTGRES_SCHEMA

# revision identifiers, used by Alembic.
revision: str = "885f18ec1430"
down_revision: Union[str, None] = "587b3159a5fb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(sa.text(f"SET search_path TO {POSTGRES_SCHEMA}, public;"))

    op.create_table(
        "_auth",
        sa.Column("user_id", sa.TEXT, sa.ForeignKey("user.id"), primary_key=True),
        sa.Column("password", sa.TEXT, nullable=False),
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
    op.drop_table("_auth", schema=POSTGRES_SCHEMA)
