// services/analyticsService.ts

import { UserProfile } from "../types";

/**
 * A mock analytics and user management service.
 * In a real-world application, this service would interact with a backend database.
 * For this client-side app, it uses localStorage to persist user profiles.
 */
class AnalyticsService {
  private readonly COMMUNITY_USERS_KEY = "devilfintech-community-users";

  private getUsers(): UserProfile[] {
    try {
      const savedUsers = localStorage.getItem(this.COMMUNITY_USERS_KEY);
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.error("Failed to retrieve users from localStorage", error);
    }
    return [];
  }

  private saveUsers(users: UserProfile[]): void {
    try {
      localStorage.setItem(this.COMMUNITY_USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users to localStorage", error);
    }
  }

  /**
   * Handles user login. If the user exists, it updates their avatar and active time.
   * If they are new, it creates a new profile for them.
   * @param username The user's chosen name.
   * @param avatarId The user's chosen avatar.
   * @returns The full UserProfile object.
   */
  loginUser(username: string, avatarId: string): UserProfile {
    const users = this.getUsers();
    const lowerCaseUsername = username.toLowerCase();
    let user = users.find((u) => u.name.toLowerCase() === lowerCaseUsername);

    if (user) {
      // Existing user, update their avatar and last active time
      user.avatarId = avatarId;
      user.lastActive = new Date().toISOString();
    } else {
      // New user, create a profile with unique ID
      const uniqueId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      user = {
        id: uniqueId, // Use unique ID instead of username
        name: username,
        avatarId,
        score: 0,
        lastActive: new Date().toISOString(),
      };
      users.push(user);
    }

    this.saveUsers(users);
    return user;
  }

  /**
   * Retrieves a single user's profile.
   * @param username The name of the user to find.
   * @returns The UserProfile object or undefined if not found.
   */
  getUser(username: string): UserProfile | undefined {
    const users = this.getUsers();
    return users.find((u) => u.name.toLowerCase() === username.toLowerCase());
  }

  /**
   * Updates a user's score by adding the given points.
   * @param username The name of the user to update.
   * @param points The number of points to add.
   */
  updateUserScore(username: string, points: number): void {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === username);

    if (userIndex > -1) {
      users[userIndex].score += points;
      users[userIndex].lastActive = new Date().toISOString();
      this.saveUsers(users);
    } else {
      console.warn(
        `[Analytics Service] Attempted to update score for non-existent user: ${username}`
      );
    }
  }

  /**
   * Retrieves all community user data.
   * @returns An object containing an array of all user profiles.
   */
  getCommunityData(): { users: UserProfile[] } {
    const users = this.getUsers();
    return { users };
  }

  /**
   * Gets the total number of registered users.
   * @returns The total count of users.
   */
  getTotalUsersCount(): number {
    const users = this.getUsers();
    return users.length;
  }
}

// Export a singleton instance of the service
export const analyticsService = new AnalyticsService();
