import { getConnection, getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("LOWER(title) like :title", { title: `%${param}%`.toLowerCase() })
      .getMany()
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(
      `SELECT count(*) as count FROM games`
    ); 
    // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {

    const gameWithUsers = await this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect('games.users', 'user')
      .where("games.id = :id", { id })
      .getOneOrFail();

    // if (gameWithUsers) {
    //   return gameWithUsers.users;
    // }

    return gameWithUsers.users

  }
}
