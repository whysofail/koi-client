const fetchToRevokeToken = async (token: string) => {
  const res = await fetch(`${process.env.BACKEND_URL}/api/auth/revoke-token`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export default fetchToRevokeToken;
