export default async function Auth(req, res, next) {
  try {
    const token = req.headers.autherization;
    res.json(token);
  } catch (error) {
    res.status(401).json({ error: "Autherization Failed" });
  }
}
