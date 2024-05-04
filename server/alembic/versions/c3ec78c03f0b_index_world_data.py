"""index_world_data

Revision ID: c3ec78c03f0b
Revises: 885f18ec1430
Create Date: 2024-05-03 18:22:18.341893

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op
from tripcraft.constants import ELASTICSEARCH_URL

# revision identifiers, used by Alembic.
revision: str = "c3ec78c03f0b"
down_revision: Union[str, None] = "885f18ec1430"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION zombodb")

    op.execute("ALTER TABLE regions ALTER COLUMN name TYPE zdb.fulltext")
    op.execute("ALTER TABLE subregions ALTER COLUMN name TYPE zdb.fulltext")
    op.execute("ALTER TABLE countries ALTER COLUMN name TYPE zdb.fulltext")
    op.execute("ALTER TABLE states ALTER COLUMN name TYPE zdb.fulltext")
    op.execute("ALTER TABLE cities ALTER COLUMN name TYPE zdb.fulltext")

    op.execute("ALTER TABLE regions ALTER COLUMN translations TYPE zdb.fulltext")
    op.execute("ALTER TABLE subregions ALTER COLUMN translations TYPE zdb.fulltext")
    op.execute("ALTER TABLE countries ALTER COLUMN translations TYPE zdb.fulltext")

    op.execute(
        "CREATE INDEX idxregions "
        "ON regions USING zombodb ((regions.*)) "
        f"WITH (url='{ELASTICSEARCH_URL}')"
    )
    op.execute(
        "CREATE INDEX idxsubregions "
        "ON subregions USING zombodb ((subregions.*)) "
        f"WITH (url='{ELASTICSEARCH_URL}')"
    )
    op.execute(
        "CREATE INDEX idxcountries "
        "ON countries USING zombodb ((countries.*)) "
        f"WITH (url='{ELASTICSEARCH_URL}')"
    )
    op.execute(
        "CREATE INDEX idxstates "
        "ON states USING zombodb ((states.*)) "
        f"WITH (url='{ELASTICSEARCH_URL}')"
    )
    op.execute(
        "CREATE INDEX idxcities "
        "ON cities USING zombodb ((cities.*)) "
        f"WITH (url='{ELASTICSEARCH_URL}')"
    )


def downgrade() -> None:
    op.execute("DROP INDEX idxregions")
    op.execute("DROP INDEX idxsubregions")
    op.execute("DROP INDEX idxcountries")
    op.execute("DROP INDEX idxstates")
    op.execute("DROP INDEX idxcities")

    op.execute("ALTER TABLE regions ALTER COLUMN name TYPE text")
    op.execute("ALTER TABLE subregions ALTER COLUMN name TYPE text")
    op.execute("ALTER TABLE countries ALTER COLUMN name TYPE text")
    op.execute("ALTER TABLE states ALTER COLUMN name TYPE text")
    op.execute("ALTER TABLE cities ALTER COLUMN name TYPE text")

    op.execute("ALTER TABLE regions ALTER COLUMN translations TYPE text")
    op.execute("ALTER TABLE subregions ALTER COLUMN translations TYPE text")
    op.execute("ALTER TABLE countries ALTER COLUMN translations TYPE text")

    op.execute("DROP EXTENSION zombodb")
