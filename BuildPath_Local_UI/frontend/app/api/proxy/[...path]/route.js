import { getAccessToken, withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

const API_BASE = process.env.EXPRESS_API_URL || 'http://localhost:8080/api/v1';

async function handleProxy(req, { params }) {
  try {
    // We cannot use getAccessToken from edge/middleware inside a Route Handler easily without passing req & res
    // Auth0 nextjs sdk app router requires passing request and response objects
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);
    
    // Construct the target URL
    const path = params.path ? params.path.join('/') : '';
    const url = new URL(req.url);
    const search = url.search; // append query params
    
    const targetUrl = `${API_BASE}/${path}${search}`;

    // Prepare headers
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${accessToken}`);
    
    // Forward Content-Type if present
    const contentType = req.headers.get('content-type');
    if (contentType) {
      headers.set('Content-Type', contentType);
    }

    // Forward body if it's a mutation
    const init = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      try {
        const body = await req.text(); // Read raw body
        if (body) {
          init.body = body;
        }
      } catch (e) {
        // no body
      }
    }

    // Make the proxied request
    const apiResponse = await fetch(targetUrl, init);
    
    // We must return a new response with the API data
    const apiData = await apiResponse.text();

    return new NextResponse(apiData, {
      status: apiResponse.status,
      headers: {
        'Content-Type': apiResponse.headers.get('content-type') || 'application/json',
      },
    });

  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: error.status || 500 });
  }
}

export const GET = withApiAuthRequired(handleProxy);
export const POST = withApiAuthRequired(handleProxy);
export const PUT = withApiAuthRequired(handleProxy);
export const PATCH = withApiAuthRequired(handleProxy);
export const DELETE = withApiAuthRequired(handleProxy);
