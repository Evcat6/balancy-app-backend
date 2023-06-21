import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly descriotion: string;

  @IsNotEmpty()
  readonly category: string;

  @IsNotEmpty()
  readonly priority: string;
}
