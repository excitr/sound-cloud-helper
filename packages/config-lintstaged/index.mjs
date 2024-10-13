export const nodeLintStagedConfig = {
  '*.ts': ['prettier --write', 'eslint --fix --max-warnings 0'],
};

export const reactLintStagedConfig = {
  ...nodeLintStagedConfig,
  '*.tsx': ['prettier --write', 'eslint --fix --max-warnings 0'],
};

export const mdStagedConfig = {
  '*.md': ['prettier --write'],
};

export const terraformStagedConfig = {
  '*.tf': 'terraform fmt',
};

export const prismaStagedConfig = {
  '*.prisma': 'prisma format --schema ./prisma/schema.prisma',
};
