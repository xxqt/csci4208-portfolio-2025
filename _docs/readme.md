# Course Roadmap & Project Guide

Welcome! This repo is your **portfolio + project board** for the course.  
You’ll track work with GitHub **Issues** and a **Project (v2)** board, and deploy your static work with **GitHub Pages**.

---

## TL;DR (first 10 minutes)

1. **Enable Actions** (first time only): go to the **Actions** tab → click **Enable**.  
2. **Sync labels** (colors/descriptions): Actions → **Sync labels** → **Run workflow**.  
3. **Seed/Update issues** from the instructor roadmap: Actions → **Seed / Update Roadmap Issues** → **Run workflow**.  
   - Optional: set a repo variable `ROADMAP_SRC` to the instructor RAW URL if asked.  
4. **Create your Project (v2)** board and **auto-add** issues (see below).  
5. **Enable GitHub Pages**: Settings → **Pages** → *Deploy from branch* → Branch **main**, Folder **/**.  
6. Edit **`index.html`** (repo root) to link finished labs/projects (live URLs).

---

## Repo layout

```

/
├─ index.html                # Your simple portfolio landing page (edit this!)
├─ labs/
│  ├─ lab-01/                # Each lab goes in its own folder (entry index.html)
│  └─ lab-02/
├─ projects/
│  └─ project-01/            # Each project folder; keep a README.md inside
├─ capstone/
│  └─ capstone-01/           # Capstone docs per milestone
└─ \_docs/
└─ README.md              # (this file)

````

---

## One-time setup

### 1) Enable Issues
Settings → **General** → **Features** → ensure **Issues** is checked.

### 2) Enable Actions
Go to the **Actions** tab → click **Enable** if prompted.

### 3) (Optional) Hook to instructor roadmap automatically
If your instructor gave you a URL, add a repo **Variable**:
- Settings → **Secrets and variables** → **Actions** → **Variables** → **New variable**  
  - **Name:** `ROADMAP_SRC`  
  - **Value:** `https://raw.githubusercontent.com/<instructor>/<course-repo>/main/.github/roadmap.json`

> If you don’t set it, the seeder uses its built-in default URL or your local `.github/roadmap.json` if present.

### 4) Sync labels (for colors/descriptions)
Actions → **Sync labels** → **Run workflow**  
*(This just styles labels; if you skip it, labels still work—just gray.)*

### 5) Seed / Update issues (roadmap)
Actions → **Seed / Update Roadmap Issues** → **Run workflow**  
This creates/updates:
- **Issues** (one per roadmap item) with an **Acceptance** checklist  
- **Milestones** (Modules), and assigns the issues to them  
- **Labels** (type, key, track, status)

> Tip: you can schedule this job nightly—ask your instructor or see “Automation & schedules” below.

---

## Project (v2) board

Create a personal board (this is part of your portfolio):

1) **New Project** → **Board view**  
2) **Workflows** (Project settings) → **Auto-add to project**  
   - Repositories: select **this repo**  
   - Filter: `is:issue` (or `label:task`)  
   - Turn it **On**
3) **Workflows → Item added** → set **Status = Todo** (or similar)  
4) View menu → **Board**  
   - **Column field = Status**  
   - Optional **Group by = Milestone** (rows per Module)  
   - Save the view as **“Module view”**

### Manually adding existing issues (one-time)
If you enabled Auto-add after seeding, open the Project → **Add items** → select your repo → add all issues, or re-run the seeder once.

---

## Working each assignment

- **Labs**  
  - Put source under `labs/<lab-key>/` with **`index.html`**.  
  - Add a link on the root **`index.html`** to `./labs/<lab-key>/`.  
  - Add a short `README.md` to the lab folder (Quickstart + screenshot).  
  - Mark progress with labels (see next section) and check off **Acceptance** boxes in the issue.

- **Projects**  
  - Put source under `projects/<project-key>/` with a **README.md** (feature list, screenshot, live URL).  
  - **Deploy required** for static projects (Pages/Netlify/Vercel).  
  - Link the **live URL** on the root `index.html`.

- **Capstone**  
  - Keep your team roster and board URL in `capstone/capstone-01/README.md`.  
  - Each capstone milestone has an issue; keep it updated.

---

## Labels you will use

| Category | Label | Meaning / When to use |
|---|---|---|
| **Status** | `task` | Parent tag for roadmap items (applied automatically) |
| | `peer-review-requested` | You’re asking classmates to review your work |
| | `reviewed` | A peer has reviewed your work |
| | `ready-for-approval` | You want instructor sign-off |
| | `changes-requested` | Revisions needed (peer or instructor) |
| | `blocked` | Waiting on something else |
| | `completed` | You finished the work (final state you set) |
| | `approved` | Instructor sign-off (final state instructors set) |
| | `deployed` | Live URL verified |
| **Type** | `lab` / `project` / `capstone` | Item type (auto-applied by seeder) |
| **Track** | `Frontend` / `Backend` / `DB` / `HTTP-Server` / `Security` / `Testing` | Multi-select tech areas |
| **Key** | `lab-01`, `lab-02`, `project-01`, `capstone-01` | Stable identifiers used for matching |
| **Module** | `module-01` (label) + **Milestone** | Use **Milestones** to group by module on the board |

> **Do not rename/delete** `lab-01`/`project-01` etc. Keys are how updates are matched.

### Handy filters (Issues search)
- All open items this module: `is:issue is:open label:module-01`  
- Your open labs: `is:issue is:open label:lab`  
- Ready for approval: `is:issue label:ready-for-approval`  
- Peer review queue: `is:issue label:peer-review-requested`

---

## Automation & schedules (optional)

If you want nightly updates:
```yaml
# in .github/workflows/seed-roadmap.yml
on:
  workflow_dispatch: {}
  schedule:
    - cron: "59 4,5 * * *"   # 11:59 PM US Central (covers CDT & CST)
````

* Cron is **UTC**.
* Schedules only run after you **Enable Actions**.
* If GitHub pauses schedules after long inactivity, run the job manually once.

---

## Common tasks

### Run “Seed / Update Roadmap Issues” manually

Actions → **Seed / Update Roadmap Issues** → **Run workflow**
*(Use this after the instructor publishes new items.)*

### Sync label colors/descriptions

Actions → **Sync labels** → **Run workflow**
*(Functionality works without this—colors/descriptions are just nicer.)*

### Make your Project public

Open your Project → **Settings** → **Make public**.
Share the link on your resume/LinkedIn.

---

## Troubleshooting

**“Issues has been disabled in this repository.”**
→ Settings → **General → Features → Issues** (enable), then re-run.

**“No jobs were run.”**
→ You ran the workflow on a branch that doesn’t contain the YAML. Switch to **main** in the Run dialog.

**Roadmap updates didn’t apply.**

* Make sure you ran **Seed / Update Roadmap Issues** after the instructor changed the plan.
* The workflow now cache-busts the remote JSON; if still stuck, check the run logs to confirm it loaded the new text and which key/issue it upserted.

**Items not showing on my Project.**

* Project **Workflows → Auto-add** must be **On** for this repo.
* Use **Add items** in the project to backfill existing issues, or re-run the seeder.

**Milestone date didn’t change.**

* The module **Milestone** gets its `due_on` from items whose `due` is ISO (`YYYY-MM-DDTHH:mm:ss-ZZ:ZZ`).
* If multiple items share a milestone, the last processed date wins (that’s OK—modules usually share one deadline).

---

## FAQ

**Do labs and projects have to be deployed?**

* **Static phase:** Yes—publish to GitHub Pages (labs + project).
* Later (Node/HTTP-Server), you’ll provide a README with run/deploy steps; live URL optional unless stated.

**Can a task have multiple tracks?**
Yes. Apply all that fit (e.g., `Frontend`, `Backend`, `Security`).

**How do I show progress to peers/instructor?**
Use the status labels: start with `peer-review-requested`, move to `reviewed`, then `ready-for-approval`. Instructors may add `approved`.

---

## Glossary

* **Key** — Stable label (e.g., `lab-01`) used to match updates.
* **Milestone** — Module grouping with an optional due date; use it for board rows.
* **Project (v2)** — Your kanban; auto-add issues from this repo.

---


