import AsyncStorage from '@react-native-async-storage/async-storage';

class TokenService {
    private static instance: TokenService;
    private token: string | null = null;
    private refreshToken: string | null = null;

    private constructor() {}

    static getInstance(): TokenService {
        if (!TokenService.instance) {
            TokenService.instance = new TokenService();
        }
        return TokenService.instance;
    }

    async initialize() {
        try {
            const storedTokens = await AsyncStorage.getItem('auth-tokens');
            if (storedTokens) {
                const { token, refreshToken } = JSON.parse(storedTokens);
                this.token = token;
                this.refreshToken = refreshToken;
            }
        } catch (error) {
            console.error('Error initializing tokens:', error);
        }
    }

    getToken(): string | null {
        return this.token;
    }

    getRefreshToken(): string | null {
        return this.refreshToken;
    }

    async setTokens(token: string, refreshToken: string) {
        this.token = token;
        this.refreshToken = refreshToken;
        try {
            await AsyncStorage.setItem('auth-tokens', JSON.stringify({ token, refreshToken }));
        } catch (error) {
            console.error('Error storing tokens:', error);
        }
    }

    async clearTokens() {
        this.token = null;
        this.refreshToken = null;
        try {
            await AsyncStorage.removeItem('auth-tokens');
        } catch (error) {
            console.error('Error clearing tokens:', error);
        }
    }
}

export const tokenService = TokenService.getInstance(); 