import { Rule, RuleType } from '@midwayjs/validate';

export class CreateMessageDTO {
    @Rule(RuleType.number().required())
    seriesId: number;

    @Rule(RuleType.string().required())
    content: string;
}

export class UpdateMessageDTO {
    @Rule(RuleType.string().required())
    content: string;
} 