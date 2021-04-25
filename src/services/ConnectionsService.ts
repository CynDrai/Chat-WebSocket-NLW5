import { getCustomRepository, Repository } from "typeorm";
import { Connection } from "../entities/Connection";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IConnectionCreate {
  socket_id: string;
  user_id: string;
  admin_id?: string;
  id?: string
}

class ConnectionsService {
  private connectionsRepository: Repository<Connection>;

  constructor() {
    this.connectionsRepository = getCustomRepository(ConnectionsRepository);
  }

  async create({socket_id, user_id, admin_id, id}: IConnectionCreate) {
    const connection = this.connectionsRepository.create({
      socket_id,
      user_id,
      admin_id,
      id
    });

    await this.connectionsRepository.save(connection);

    return connection;
  }

  async findByUserId(user_id: string) {
    return await this.connectionsRepository.findOne({user_id: user_id});
  }

  async findAllWithoutAdmin() {
    return await this.connectionsRepository.find({
      where: { admin_id: null },
      relations: ["user"]
    });
  }

  async findBySocketId(socket_id: string) {
    return await this.connectionsRepository.findOne({socket_id: socket_id});
  }

  async updateAdminId(user_id: string, admin_id: string) {
    await this.connectionsRepository
      .createQueryBuilder()
      .update(Connection)
      .set({admin_id})
      .where("user_id = :user_id", {user_id})
      .execute();
  }
}

export { ConnectionsService };