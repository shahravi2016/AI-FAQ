"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Types for admin authentication
interface AdminCredentials {
  username: string
  password: string
}

// Mock admin credentials (in production, use environment variables)
const ADMIN_CREDENTIALS = {
  username: "admin@1",
  password: "password{123}"
}

// Analytics data interface
export interface QuestionAnalytics {
  mostAsked: { category: string; count: number }[]
  leastAsked: { category: string; count: number }[]
  mostImportant: { category: string; importance: number }[]
  critical: { category: string; count: number }[]
  basic: { category: string; count: number }[]
  general: { category: string; count: number }[]
  technical: { category: string; count: number }[]
}

export async function authenticateAdmin(credentials: AdminCredentials) {
  if (
    credentials.username === ADMIN_CREDENTIALS.username &&
    credentials.password === ADMIN_CREDENTIALS.password
  ) {
    // Set admin session cookie
    cookies().set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 // 24 hours
    })
    return { success: true }
  }
  return { success: false, error: "Invalid credentials" }
}

export async function verifyAdminSession() {
  const session = cookies().get("admin_session")
  if (!session || session.value !== "authenticated") {
    redirect("/admin/login")
  }
  return true
}

export async function logoutAdmin() {
  cookies().delete("admin_session")
  redirect("/admin/login")
}

// Function to get analytics data from the backend
export async function getQuestionAnalytics(): Promise<QuestionAnalytics> {
  try {
    const response = await fetch(`https://ai-faq-production.up.railway.app/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Disable caching to always get fresh data
    })

    if (!response.ok) {
      throw new Error('Failed to fetch analytics data')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching analytics:', error)
    // Return mock data as fallback
    return {
      mostAsked: [
        { category: "Technical", count: 2847 },
        { category: "Creative", count: 2156 },
        { category: "Educational", count: 1923 }
      ],
      leastAsked: [
        { category: "Research", count: 631 },
        { category: "Personal", count: 987 },
        { category: "Business", count: 1456 }
      ],
      mostImportant: [
        { category: "Research", importance: 9.8 },
        { category: "Educational", importance: 9.5 },
        { category: "Technical", importance: 9.2 }
      ],
      critical: [
        { category: "System", count: 450 },
        { category: "Security", count: 380 },
        { category: "Performance", count: 320 }
      ],
      basic: [
        { category: "General", count: 1200 },
        { category: "FAQ", count: 980 },
        { category: "Support", count: 850 }
      ],
      general: [
        { category: "General", count: 1200 },
        { category: "FAQ", count: 980 },
        { category: "Support", count: 850 }
      ],
      technical: [
        { category: "Programming", count: 1500 },
        { category: "Infrastructure", count: 1200 },
        { category: "Database", count: 900 }
      ]
    }
  }
} 