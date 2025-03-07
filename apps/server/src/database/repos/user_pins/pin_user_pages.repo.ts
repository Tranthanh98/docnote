import { PinUserPages } from '@docmost/db/types/db';
import { InsertablePinUserPage } from '@docmost/db/types/entity.types';
import { KyselyDB, KyselyTransaction } from '@docmost/db/types/kysely.types';
import { dbOrTx } from '@docmost/db/utils';
import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';

@Injectable()
export class PinUserPageRepo {
  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async getPinnedPagesByUserIdAndWorkspaceId(
    userId: string,
    workspaceId: string,
    trx?: KyselyTransaction,
  ): Promise<PinUserPages[]> {
    const db = dbOrTx(this.db, trx);

    return db
      .selectFrom('pinUserPages')
      .selectAll('pinUserPages')
      .where('userId', '=', userId)
      .where('workspaceId', '=', workspaceId)
      .$castTo<PinUserPages>()
      .execute();
  }

  async addNewPin(insertPin: InsertablePinUserPage, trx?: KyselyTransaction) {
    const db = dbOrTx(this.db, trx);

    return db
      .insertInto('pinUserPages')
      .values(insertPin)
      .returningAll()
      .executeTakeFirst();
  }
}
