# Go Script System Architecture

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │      go.sh            │  ◄── Main Entry Point
         │  (Interactive Menu)   │
         └───────────┬───────────┘
                     │
                     │ sources
                     ▼
         ┌───────────────────────┐
         │    go.lib.sh          │  ◄── Common Library
         │  • Colors             │
         │  • Configuration      │
         │  • Utility Functions  │
         └───────────────────────┘
                     │
                     │ provides functions to
                     ▼
    ┌────────────────┴────────────────┐
    │                                  │
    ▼                                  ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ go.0.sh │  │ go.1.sh │  │ go.2.sh │  │ go.3.sh │
│  Local  │  │ Deploy  │  │  Build  │  │  Clean  │
│   Dev   │  │         │  │         │  │         │
└─────────┘  └─────────┘  └─────────┘  └─────────┘
     │            │            │            │
     │            │            │            │
     ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────┐
│              Target Systems                      │
│  • Local Server (8080)                          │
│  • Production Server (quexitai.com)            │
│  • Git Repository (GitHub)                      │
└─────────────────────────────────────────────────┘
```

## 🔄 Execution Flow

### Option 0: Local Development

```
User runs: ./go.sh 0
    │
    ├─► Load go.lib.sh
    │
    ├─► Execute go.0.sh
    │   │
    │   ├─► Check dependencies (Java, MySQL)
    │   │
    │   ├─► Build backend (if needed)
    │   │   └─► call: build_backend()
    │   │
    │   ├─► Kill port 8080
    │   │   └─► call: kill_port(8080)
    │   │
    │   ├─► Start backend service
    │   │
    │   └─► Display URLs and info
    │
    └─► Show elapsed time
```

### Option 1: Deploy to Server

```
User runs: ./go.sh 1
    │
    ├─► Load go.lib.sh
    │
    ├─► Execute go.1.sh
    │   │
    │   ├─► Check Git status
    │   │   └─► call: check_git_status()
    │   │
    │   ├─► Build backend locally
    │   │   └─► call: build_backend()
    │   │
    │   ├─► Get commit message (user input)
    │   │
    │   ├─► Commit and push to Git
    │   │   └─► call: git_commit_push()
    │   │
    │   ├─► Confirm deployment (user input)
    │   │
    │   ├─► Deploy to server
    │   │   └─► call: deploy_to_server()
    │   │       │
    │   │       ├─► SSH to server
    │   │       ├─► Pull latest code
    │   │       ├─► Stop old service
    │   │       ├─► Build on server
    │   │       ├─► Start new service
    │   │       └─► Verify deployment
    │   │
    │   └─► Verify external API
    │
    └─► Show elapsed time
```

### Option 2: Build Only

```
User runs: ./go.sh 2
    │
    ├─► Load go.lib.sh
    │
    ├─► Execute go.2.sh
    │   │
    │   ├─► Build backend
    │   │   └─► call: build_backend()
    │   │       │
    │   │       ├─► Check Java
    │   │       ├─► Run Maven
    │   │       └─► Verify JAR
    │   │
    │   └─► Display build info
    │
    └─► Show elapsed time
```

### Option 3: Clean Cache

```
User runs: ./go.sh 3
    │
    ├─► Load go.lib.sh
    │
    ├─► Execute go.3.sh
    │   │
    │   ├─► Clean backend/target
    │   │
    │   ├─► Clean logs
    │   │
    │   ├─► Clean temp files
    │   │
    │   └─► Optional: Clean IDE files
    │       └─► call: confirm()
    │
    └─► Show elapsed time
```

## 📦 Module Dependencies

```
┌──────────────────────────────────────────────────┐
│                   go.sh                          │
│  • Entry point                                   │
│  • Menu display                                  │
│  • Script routing                                │
└────────────────┬─────────────────────────────────┘
                 │
                 │ requires
                 ▼
┌──────────────────────────────────────────────────┐
│                go.lib.sh                         │
│  ┌────────────────────────────────────────────┐ │
│  │ Configuration                              │ │
│  │  • SERVER_HOST, SERVER_USER, etc.         │ │
│  └────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────┐ │
│  │ Output Functions                           │ │
│  │  • success(), error(), warn(), info()     │ │
│  └────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────┐ │
│  │ Check Functions                            │ │
│  │  • check_command(), check_port()          │ │
│  └────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────┐ │
│  │ Git Functions                              │ │
│  │  • check_git_status(), git_commit_push()  │ │
│  └────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────┐ │
│  │ Build Functions                            │ │
│  │  • build_backend()                        │ │
│  └────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────┐ │
│  │ Deploy Functions                           │ │
│  │  • deploy_to_server()                     │ │
│  └────────────────────────────────────────────┘ │
└────────────────┬─────────────────────────────────┘
                 │
                 │ used by
                 ▼
┌────────┬────────┬────────┬────────┐
│go.0.sh │go.1.sh │go.2.sh │go.3.sh │
└────────┴────────┴────────┴────────┘
```

## 🔌 External Integrations

```
┌─────────────────────────────────────────────────┐
│            Go Script System                      │
└────────┬────────────────────────────────────────┘
         │
         ├─► Git Repository (GitHub)
         │   • git add, commit, push
         │   • Branch: main
         │
         ├─► Local Backend Server
         │   • Port: 8080
         │   • Java Spring Boot
         │   • MySQL Database
         │
         ├─► Production Server (SSH)
         │   • Host: quexitai.com
         │   • User: root
         │   • Path: /opt/easy-joy-life
         │
         └─► Build Tools
             • Maven (mvn/mvnw)
             • Java 11+
```

## 📊 Data Flow

### Local Development (Option 0)

```
┌──────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ User │────►│  go.sh   │────►│ go.0.sh  │────►│  Local   │
└──────┘     └──────────┘     └──────────┘     │  Server  │
                                                 │  :8080   │
                                                 └──────────┘
```

### Deployment (Option 1)

```
┌──────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ User │────►│  go.sh   │────►│ go.1.sh  │────►│   Git    │
└──────┘     └──────────┘     └──────────┘     │  GitHub  │
                                                 └────┬─────┘
                                                      │
                                                      ▼
                                                 ┌──────────┐
                                                 │Production│
                                                 │  Server  │
                                                 └──────────┘
```

### Build Only (Option 2)

```
┌──────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ User │────►│  go.sh   │────►│ go.2.sh  │────►│  Maven   │
└──────┘     └──────────┘     └──────────┘     │  Build   │
                                                 └────┬─────┘
                                                      │
                                                      ▼
                                                 ┌──────────┐
                                                 │   JAR    │
                                                 │   File   │
                                                 └──────────┘
```

### Clean Cache (Option 3)

```
┌──────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ User │────►│  go.sh   │────►│ go.3.sh  │────►│  Delete  │
└──────┘     └──────────┘     └──────────┘     │  Files   │
                                                 └──────────┘
```

## 🎯 Function Call Graph

```
go.sh
  │
  ├─► check_project_root()
  │
  └─► go.X.sh
      │
      ├─► success()
      ├─► error()
      ├─► warn()
      ├─► info()
      ├─► step()
      │
      ├─► check_command()
      ├─► check_port()
      ├─► kill_port()
      │
      ├─► check_git_status()
      ├─► git_commit_push()
      │
      ├─► build_backend()
      │
      ├─► deploy_to_server()
      │
      ├─► confirm()
      │
      └─► show_elapsed_time()
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────┐
│              Security Layers                     │
├─────────────────────────────────────────────────┤
│  1. SSH Key Authentication                      │
│     • No password in scripts                    │
│     • Key-based server access                   │
├─────────────────────────────────────────────────┤
│  2. Deployment Exclusion (.deployignore)        │
│     • Exclude sensitive files                   │
│     • Exclude IDE configs                       │
│     • Exclude test files                        │
├─────────────────────────────────────────────────┤
│  3. User Confirmation                           │
│     • Confirm before deployment                 │
│     • Confirm before cleaning                   │
├─────────────────────────────────────────────────┤
│  4. Error Handling                              │
│     • Graceful error messages                   │
│     • No sensitive info in errors               │
│     • Safe failure modes                        │
└─────────────────────────────────────────────────┘
```

## 📈 Scalability

### Adding New Options

```
Current:
  go.0.sh ─┐
  go.1.sh  ├─► go.lib.sh
  go.2.sh  │
  go.3.sh ─┘

Future:
  go.0.sh ─┐
  go.1.sh  │
  go.2.sh  ├─► go.lib.sh
  go.3.sh  │
  go.4.sh  │  ◄── New: Run tests
  go.5.sh  │  ◄── New: Database backup
  go.6.sh ─┘  ◄── New: Custom task
```

### Extending Library

```
go.lib.sh
  │
  ├─► Current Functions
  │   • Output, Check, Git, Build, Deploy
  │
  └─► Future Functions
      • Database operations
      • Docker operations
      • Monitoring operations
      • Backup operations
```

## 🎨 Design Patterns

### 1. Modular Design
- Separation of concerns
- Single responsibility
- Loose coupling

### 2. Library Pattern
- Reusable functions
- Centralized configuration
- DRY principle

### 3. Template Method
- Common workflow in go.sh
- Specific implementation in go.X.sh
- Consistent structure

### 4. Strategy Pattern
- Different deployment strategies
- Pluggable options
- Easy to extend

## 📝 Configuration Management

```
┌─────────────────────────────────────────────────┐
│              Configuration                       │
├─────────────────────────────────────────────────┤
│  go.lib.sh                                      │
│  ┌───────────────────────────────────────────┐ │
│  │ SERVER_HOST="quexitai.com"              │ │
│  │ SERVER_USER="root"                        │ │
│  │ SERVER_PATH="/opt/easy-joy-life"         │ │
│  │ BACKEND_JAR="easy-joy-life-system.jar"   │ │
│  │ SITE_URL="https://www.quexitai.com"            │ │
│  │ GIT_BRANCH="main"                         │ │
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  .deployignore                                  │
│  ┌───────────────────────────────────────────┐ │
│  │ .git                                      │ │
│  │ .vscode                                   │ │
│  │ *Test.java                                │ │
│  │ debug-*.js                                │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## 🔄 State Management

```
┌─────────────────────────────────────────────────┐
│              System States                       │
├─────────────────────────────────────────────────┤
│  1. Initial State                               │
│     • No services running                       │
│     • Clean workspace                           │
├─────────────────────────────────────────────────┤
│  2. Development State (go.sh 0)                 │
│     • Local server running                      │
│     • Port 8080 in use                          │
├─────────────────────────────────────────────────┤
│  3. Building State (go.sh 2)                    │
│     • Maven running                             │
│     • JAR being created                         │
├─────────────────────────────────────────────────┤
│  4. Deploying State (go.sh 1)                   │
│     • Git pushing                               │
│     • Server updating                           │
│     • Service restarting                        │
├─────────────────────────────────────────────────┤
│  5. Cleaning State (go.sh 3)                    │
│     • Deleting files                            │
│     • Freeing space                             │
└─────────────────────────────────────────────────┘
```

---

**Architecture Version**: 1.0  
**Last Updated**: 2026-02-05  
**Based on**: ZERO Framework
