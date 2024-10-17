# Sound cloud helper

Increase your followers in sound cloud.

## Development Setup

### Prerequisites

- [mysql](https://dev.mysql.com/downloads/installer/)
- [pnpm](https://pnpm.io/installation)

### Setup

1. Clone the repo
2. Create a db named `sound_cloud_helper` in mysql
3. Create a .env file in the `packages/database`, `apps/backoffice`, `apps/web` directory with the following content:
   ```env
   DATABASE_URL=mysql://root:<DB_PASS>@localhost:3306/sound_cloud_helper
   ```
4. Run `pnpm i`
5. Run `pnpm dev`
6. Verify that the tables have been created.
7. Open [http://localhost:3000](http://localhost:3000)
