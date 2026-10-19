interface ListedUser {
  email?: string;
}

interface UserDirectory {
  listUsers: (options: { page: number; perPage: number }) => Promise<{
    data: { users: ListedUser[] };
    error: unknown;
  }>;
}

// Exhaust the directory before deciding that a verified Telegram account is new.
export async function findTelegramUser(directory: UserDirectory, email: string) {
  const perPage = 1000;
  for (let page = 1; ; page++) {
    const { data, error } = await directory.listUsers({ page, perPage });
    if (error) throw error;
    const existing = data.users.find((user) => user.email === email);
    if (existing) return existing;
    if (data.users.length < perPage) return undefined;
  }
}