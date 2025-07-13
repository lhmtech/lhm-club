// api/ytSummary.js
export default function handler(req, res) {
    if (req.method === 'POST') {
        // 直接返回请求体内容
        return res.status(200).json(req.body);
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
} 