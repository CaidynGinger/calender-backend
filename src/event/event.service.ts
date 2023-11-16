import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';

import { OpenAI } from 'openai';
import { CreateAiEventDto } from './dto/create-ai-event.dto';
import { User } from 'src/user/entities/user.entity';
const openai = new OpenAI({
  apiKey: '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',
});

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createEventDto: CreateEventDto) {

    const user = await this.userRepository.findOne({ where: { id: createEventDto.assignedUser.id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    createEventDto.assignedUser = user;

    const newEvent = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(newEvent);
  }

  async createAiApi(createAiEventDto: CreateAiEventDto) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant. who creates events for a calendar app',
        },
        { role: 'user', content: createAiEventDto.message },
        {
          role: 'assistant',
          content:
            "here is the formate that the api needs title, date, time, description",
        },
        { role: 'user', content: 'Can I have the JSON formate' },
      ],
      model: 'gpt-3.5-turbo',
    });

    const jsonObject = extractJsonObject(completion.choices[0].message.content);

    // Check if a valid JSON object was extracted
    if (jsonObject) {
      console.log(jsonObject);
    } else {
      console.log('No valid JSON object found in the response.');
    }

    const event = { ...jsonObject, date: new Date(jsonObject.date), assignedUser: createAiEventDto.userId };

    const newEvent = this.eventRepository.create(event);
    return this.eventRepository.save(newEvent);

    // const newEvent = this.eventRepository.create(createEventDto);
  }

  findAll() {
    return this.eventRepository.find();
  }

  async findOne(id: number) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new Error(`Event with id ${id} not found`);
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const eventToUpdate = await this.findOne(id);
    return this.eventRepository.save({
      ...eventToUpdate,
      ...updateEventDto,
    });
  }

  async remove(id: number) {
    const eventToRemove = await this.findOne(id);
    return this.eventRepository.remove(eventToRemove);
  }
}

function extractJsonObject(text) {
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart >= 0 && jsonEnd >= 0) {
    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    try {
      const jsonObject = JSON.parse(jsonString);
      return jsonObject;
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }
  return null;
}
