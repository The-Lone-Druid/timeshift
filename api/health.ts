export default async function handler(req: any, res: any) {
  // Return a simple response to verify the API is running
  return res.status(200).json({
    status: 'ok',
    message: 'TimeShift API is running',
    timestamp: new Date().toISOString()
  });
} 