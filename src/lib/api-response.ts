import { NextResponse } from 'next/server';

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function err(message: string, status: number, code?: string): NextResponse {
  return NextResponse.json({ error: { message, code } }, { status });
}

export function forbidden(): NextResponse {
  return err('Forbidden', 403, 'FORBIDDEN');
}

export function unauthorized(): NextResponse {
  return err('Unauthorized', 401, 'UNAUTHORIZED');
}

export function notFound(): NextResponse {
  return err('Not Found', 404, 'NOT_FOUND');
}
