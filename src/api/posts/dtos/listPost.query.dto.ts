import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

enum OrderBy {
  CREATE_AT = 'createAt',
  LIKES = 'likes',
  VIEWS = 'views',
}

enum Order {
  DESC = 'DESC',
  ASC = 'ASC',
}

/**
 * @description query의 값을 number로 변환
 * @param value
 * @param opts default 값이 NaN일때의 기본값
 * @returs number | null
 */
function toNumber(value: string, opts: { default?: number } = {}): number {
  let newValue: number = Number.parseInt(value || String(opts.default), 10);

  if (Number.isNaN(newValue)) {
    newValue = opts.default;
  }

  return newValue;
}

export class ListPostQueryDto {
  // 정렬
  @IsEnum(OrderBy)
  orderBy: OrderBy = OrderBy.CREATE_AT;
  @IsEnum(Order)
  order: Order = Order.DESC;

  // 검색
  @IsOptional()
  @IsString()
  search: string | undefined = undefined;

  // 필터링
  @IsOptional()
  @IsString()
  filter: string | undefined = undefined;

  // 페이징
  @Transform(({ value }) => toNumber(value, { default: 1 }))
  page = 1;

  @Transform(({ value }) => toNumber(value, { default: 10 }))
  pageCount = 10;
}
