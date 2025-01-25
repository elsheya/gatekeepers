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
      tickets: {
        Row: {
          id: number
          ticketNumber: string
          customerName: string
          phoneNumber: string
          email: string
          issueDescription: string
          status: string
          priority: string
          notified: boolean
          notes: string | null
          representativeName: string
          createdAt: string
          updatedAt: string
          comments: Json[] | null
        }
        Insert: {
          ticketNumber: string
          customerName: string
          phoneNumber: string
          email: string
          issueDescription: string
          status: string
          priority: string
          notified?: boolean
          notes?: string | null
          representativeName: string
          createdAt?: string
          updatedAt?: string
          comments?: Json[] | null
        }
        Update: {
          ticketNumber?: string
          customerName?: string
          phoneNumber?: string
          email?: string
          issueDescription?: string
          status?: string
          priority?: string
          notified?: boolean
          notes?: string | null
          representativeName?: string
          createdAt?: string
          updatedAt?: string
          comments?: Json[] | null
        }
        }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
