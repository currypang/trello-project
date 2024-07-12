import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

import { Card } from './entities/card.entity'
import { CardAssigness } from './entities/card-assigness.entity'
import { List } from '../lists/entities/list.entity'

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(CardAssigness) private cardAssignessRepository: Repository<CardAssigness>,
    @InjectRepository(List) private listRepository: Repository<List>,
  ) {}

  async create(createCardDto: CreateCardDto) {
    const { name, listId } = createCardDto;

    // 보드가 존재하는지 확인
    const existingList = await this.listRepository.findOne({
      where: { id: listId },
    });
    if (!existingList) {
      throw new BadRequestException('없는 보드입니다.');
    }

    return await this.cardRepository.manager.transaction(async (transactionalEntityManager) => {
      // 보드 ID에서 마지막 카드 찾음
      const lastCard = await transactionalEntityManager.findOne(Card, {
        where: { listId },
        order: { position: 'DESC' },
      });

      // 카드 위치 지정
      const newPosition = lastCard
        ? lastCard.position + Math.floor(Math.random() * 10000)
        : Math.floor(Math.random() * 1000);

      // 새로운 카드 생성
      const card = transactionalEntityManager.create(Card, {
        name,
        listId,
        position: newPosition,
        cardAssigness : {
          userId : userId;
        }
      });
      await transactionalEntityManager.save(Card, card);

      return card;
    });
  }

  async findAll() {
    return await this.cardRepository.find({});
  }

  async findOne(id: number) {
    await this.verifyCardById(id);

    return await this.cardRepository.findOne({
      where: { id, deletedAt: null },
    });
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    await this.verifyCardById(id);

    if (!(updateCardDto instanceof UpdateCardDto)) {
      throw new BadRequestException('Invalid updateCardDto');
    }

    return await this.cardRepository.update({ id }, updateCardDto );
  }

  async delete(id: number) {
    await this.verifyCardById(id);
    const post = await this.cardRepository.delete({ id });
    return post;
  }


  private async verifyCardById(id: number) {
    const card = await this.cardRepository.findOneBy({ id });
    if (_.isNil(card)) {
      throw new NotFoundException('존재하지 않는 카드입니다.');
    }

    return card;
  }
}
