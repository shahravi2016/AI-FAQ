"""add analytics columns

Revision ID: add_analytics_columns
Revises: 
Create Date: 2024-03-19

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_analytics_columns'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Add new columns
    op.add_column('questions', sa.Column('category', sa.String(50), nullable=True))
    op.add_column('questions', sa.Column('importance', sa.Float(), nullable=True, server_default='5.0'))
    op.add_column('questions', sa.Column('is_critical', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('questions', sa.Column('updated_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP')))

    # Set default category for existing rows
    op.execute("UPDATE questions SET category = 'general' WHERE category IS NULL")

    # Make category non-nullable after setting defaults
    op.alter_column('questions', 'category', nullable=False)

def downgrade():
    # Remove columns
    op.drop_column('questions', 'updated_at')
    op.drop_column('questions', 'is_critical')
    op.drop_column('questions', 'importance')
    op.drop_column('questions', 'category') 