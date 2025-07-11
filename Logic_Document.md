# Logic_Document

## Smart Assign Implementation

**Smart Assign** is a feature that automatically assigns a new task to the team member with the fewest active tasks (tasks in 'To Do' or 'In Progress').

- When a new task is created (or when Smart Assign is triggered on a task), the backend checks all users and counts how many active tasks each has.
- The user with the lowest number of active tasks is selected as the assignee.
- This ensures work is distributed as evenly as possible among team members.
- If there is a tie, the first user found with the lowest count is chosen.

**Example:**
- User A has 2 active tasks, User B has 1, User C has 3.
- A new task is created. Smart Assign will assign it to User B.

---

## Conflict Handling Logic

**Conflict handling** ensures that if two users try to edit the same task at the same time, no one's changes are lost without warning.

- Each task has a version number (e.g., v4, v5).
- When you edit a task, your changes are based on the version you started with (say, v4).
- If another user saves changes and the server version becomes v5 before you save, a conflict is detected when you try to save.
- The app shows a conflict dialog, displaying the differences between your version and the server's version.
- You can choose to:
  - **Overwrite**: Replace the server's version with your changes.
  - **Merge**: Combine both versions (edit the merged result before saving).

**Example:**
- You and a teammate both open Task X (version v4).
- Your teammate changes the title and saves (server is now v5).
- You change the description and try to save. The app detects a conflict.
- You see a dialog showing both versions and can choose to merge or overwrite.

This approach prevents accidental overwrites and ensures all users are aware of simultaneous edits. 