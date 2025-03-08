import {property} from '@loopback/repository';
import dayjs from "dayjs";

export function FormattedDate(format = 'YYYY-MM-DD HH:mm:ss') {
  return property({
    type: 'string',
    defaultFn: () => dayjs().format(format),
  });
}

