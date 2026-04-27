export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          type: string
          capacity: number
          image_url: string | null
          driver_id: string
          price_per_km: number
          features: string[]
          is_available: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          type: string
          capacity: number
          image_url?: string | null
          driver_id: string
          price_per_km: number
          features?: string[]
          is_available?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          type?: string
          capacity?: number
          image_url?: string | null
          driver_id?: string
          price_per_km?: number
          features?: string[]
          is_available?: boolean
        }
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          user_id: string
          vehicle_id: string
          pickup_location: string
          dropoff_location: string
          pickup_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          vehicle_id: string
          pickup_location: string
          dropoff_location: string
          pickup_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          vehicle_id?: string
          pickup_location?: string
          dropoff_location?: string
          pickup_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price?: number
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          full_name: string | null
          username: string | null
          phone: string | null
          tc_no: string | null
          avatar_url: string | null
          role: 'customer' | 'driver' | 'admin'
          is_verified: boolean
        }
        Insert: {
          id: string
          created_at?: string
          full_name?: string | null
          username?: string | null
          phone?: string | null
          tc_no?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'driver' | 'admin'
          is_verified?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string | null
          username?: string | null
          phone?: string | null
          tc_no?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'driver' | 'admin'
          is_verified?: boolean
        }
      }
    }
  }
}
