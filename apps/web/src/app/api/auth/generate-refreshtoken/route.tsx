// import { type NextApiRequest, type NextApiResponse } from 'next';
// import { generateAccessToken, verifyRefreshToken } from '../sign-in/login-api';

// export interface RefreshTokenResponse {
//     success?: boolean;
//     accessToken?: string;
//     message?: string;
// }

// export default async function POST(req: NextApiRequest, res: NextApiResponse<RefreshTokenResponse>) {
//     if (req.method !== 'POST') {
//         res.status(405).json({ message: 'Method Not Allowed' });
//         return;
//     }

//     const refreshToken = req.cookies.refreshToken;

//     if (!refreshToken) {
//         res.status(403).json({ message: 'Refresh token is required' });
//         return;
//     }

//     try {
//         const decoded = await verifyRefreshToken(refreshToken);

//         const newAccessToken = await generateAccessToken({ id: decoded.id });

//         res.json({ success: true, accessToken: newAccessToken });

//         return;
//     } catch (error) {
//         res.status(403).json({ message: 'Invalid refresh token' });

//         return;
//     }
// }
