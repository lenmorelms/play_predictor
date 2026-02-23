import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { readJson } from "@/lib/db"
import { signToken, createResponseWithCookie } from "@/lib/auth"

interface User {
  id: string
  username: string
  password: string
  role: string
  leagueId: string | null
  createdAt: string
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    const users = await readJson<User[]>("users.json")
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    )

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      )
    }

    const token = await signToken({
      userId: user.id,
      username: user.username,
      isAdmin: user.role === "admin",
    })

    return createResponseWithCookie(
      {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          leagueId: user.leagueId,
        },
      },
      token
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
