/*
 * Copyright (c) 2018-2021 aetheryx & Cynthia K. Rey
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { Guild, GuildTextableChannel, Member, Message } from 'eris'
import { readdir, stat } from 'fs/promises'
import { URL } from 'url'

const DURATION_MAP = { m: 60e3, h: 3600e3, d: 86400e3 }

export async function sleep (time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export async function readdirRecursive (path: URL): Promise<string[]> {
  const entries = await readdir(path)
  const pending: Array<Promise<string[]>> = []
  const files: string[] = []
  for (const entry of entries) {
    const entryUrl = new URL(`./${entry}`, path)
    const res = await stat(entryUrl)
    if (res.isDirectory()) {
      entryUrl.pathname += '/'
      pending.push(readdirRecursive(entryUrl))
    } else {
      files.push(entryUrl.pathname)
    }
  }

  return Promise.all(pending).then((found) => files.concat(...found))
}

export function makePluralDumb (string: string, count: number) {
  return count === 1 ? string : `${string}s`
}

export function prettyPrintTimeSpan (time: number) {
  const y = Math.floor(time / 31536000e3)
  time -= y * 31536000e3
  const d = Math.floor(time / 86400e3)
  time -= d * 86400e3
  const h = Math.floor(time / 3600e3)
  time -= h * 3600e3
  const m = Math.floor(time / 60e3)
  time -= m * 60e3
  const s = Math.floor(time / 1e3)

  return [
    y && `${y} ${makePluralDumb('year', y)}`,
    d && `${d} ${makePluralDumb('day', h)}`,
    h && `${h} ${makePluralDumb('hour', h)}`,
    m && `${m} ${makePluralDumb('minute', m)}`,
    s && `${s} ${makePluralDumb('second', s)}`,
  ].filter(Boolean).join(', ') || 'under a second'
}

export function stringifyDiscordMessage (message: Message<GuildTextableChannel>) {
  return message.content
    .replace(/<a?(:\w+:)[0-9]+>/g, '$1')
    .replace(/<@!?([0-9]+)>/g, (_, id) => `@${message.channel.guild.members.get(id)?.nick ?? message._client.users.get(id)?.username ?? 'invalid-user'}`)
    .replace(/<@&([0-9]+)>/g, (_, id) => `@${message.channel.guild.roles.get(id)?.name ?? 'invalid-role'}`)
    .replace(/<#([0-9]+)>/g, (_, id) => `#${message.channel.guild.channels.get(id)?.name ?? 'deleted-channel'}`)
}

export function parseDuration (duration: string): number | null {
  const match = duration.match(/^(\d+)([mhd])$/)
  if (!match) return null

  return Number(match[1]) * DURATION_MAP[match[2] as keyof typeof DURATION_MAP]
}

export function isStaff(member: Member | string, guild?: Guild): boolean {
  if (typeof(member) !== 'string') {
    return member.permissions.has('manageMessages')
  }

  if (!guild) throw new Error('Guild required when using user id.')

  return guild.members.get(member)?.permissions.has('manageMessages') ?? false
}
