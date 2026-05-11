import { Priority } from './priority';
import { Status } from './status';

export class Task {
  readonly id = crypto.randomUUID();
  readonly createdAt = new Date();

  constructor(
    public title: string,
    public description: string,
    readonly priority: Priority,
    readonly status: Status,
  ) {}
}
