import { WasteListing, PickupRequest, QuizResult, UserProfile, UserEcoBadge, UpcycleBlueprint } from '../types';
import { db } from '../services/db';

const STORAGE_KEYS = {
  QUIZ_RESULTS: 'w2w_quiz_results_v1',
};

export const StorageService = {
  getListings(): WasteListing[] {
    return db.getListings();
  },

  saveListings(listings: WasteListing[]): void {
    db.saveListings(listings);
  },

  addListing(newListing: WasteListing): WasteListing[] {
    return db.addListing(newListing);
  },

  deleteListing(id: string): WasteListing[] {
    return db.deleteListing(id);
  },

  toggleListingStatus(id: string): WasteListing[] {
    return db.toggleListingStatus(id);
  },

  getPickups(): PickupRequest[] {
    return db.getPickups();
  },

  savePickups(pickups: PickupRequest[]): void {
    db.savePickups(pickups);
  },

  addPickup(newPickup: PickupRequest): PickupRequest[] {
    return db.addPickup(newPickup);
  },

  cancelPickup(id: string): PickupRequest[] {
    return db.cancelPickup(id);
  },

  deletePickup(id: string): PickupRequest[] {
    return db.deletePickup(id);
  },

  getQuizResults(): QuizResult[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveQuizResult(result: QuizResult): QuizResult[] {
    try {
      const current = this.getQuizResults();
      const updated = [result, ...current];
      localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(updated));
      return updated;
    } catch {
      return [result];
    }
  },

  getProfile(): UserProfile {
    return db.getProfile();
  },

  saveProfile(profile: UserProfile): void {
    db.saveProfile(profile);
  },

  getBadges(): UserEcoBadge[] {
    return db.getBadges();
  },

  resetAllData(): void {
    db.resetDatabase();
  },

  getBlueprints(): UpcycleBlueprint[] {
    return db.getBlueprints();
  },

  addBlueprint(bp: UpcycleBlueprint): UpcycleBlueprint[] {
    return db.addBlueprint(bp);
  },
};
