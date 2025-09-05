declare global {
  type AnyRecord = Record<string | number, any>;

  type Prettify<T extends AnyRecord> = {
    [K in keyof T]: T[K];
  } & {};

  type PaginatedResult<T> = {
    limit: number;
    page: number;
    total: number;
    result: Array<T>;
  };

  type TPageProps = {
    params: Promise<Record<string, string | undefined>>;
    searchParams: Promise<Record<string, string | undefined>>;
  };

  type Pagination = {
    page: number;
    limit: number;
  };

  type OptionalPagination = Partial<Pagination>;

  type QueryOptions = Prettify<
    {
      userId: string;
    } & OptionalPagination
  >;
}

export {};
