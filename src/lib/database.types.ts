
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
          closedAt: string | null
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
          closedAt?: string | null
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
          representativeName?: