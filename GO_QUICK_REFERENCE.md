# Go Script Quick Reference

## 🚀 Quick Commands

```bash
./go.sh      # Interactive menu
./go.sh 0    # Start local dev
./go.sh 1    # Deploy to server
./go.sh 2    # Build only
./go.sh 3    # Clean cache
```

## 📋 Option Details

| Option | Name | Time | Use Case |
|--------|------|------|----------|
| 0 | Local Dev | ~10s | Daily development |
| 1 | Deploy | ~3m | Production release |
| 2 | Build | ~1m | Quick build test |
| 3 | Clean | ~5s | Fix build issues |

## 🔧 Configuration (go.lib.sh)

```bash
SERVER_HOST="121.43.96.127"
SERVER_USER="root"
SERVER_PATH="/opt/easy-joy-life"
BACKEND_JAR="easy-joy-life-system-1.0.0.jar"
SITE_URL="https://xx.aieo.cn"
GIT_BRANCH="main"
```

## 📝 Common Tasks

### Start Development
```bash
./go.sh 0
# Access: http://localhost:8080
```

### Deploy to Production
```bash
./go.sh 1
# Enter commit message
# Confirm deployment
```

### Fix Build Issues
```bash
./go.sh 3  # Clean
./go.sh 2  # Rebuild
```

### Check Logs
```bash
# Local
tail -f backend/logs/spring.log

# Server
ssh root@121.43.96.127 "tail -f /var/log/easyjoylife.log"
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | `./go.sh 3` then `./go.sh 2` |
| Port in use | `pkill -f "easy-joy-life-system"` |
| SSH fails | `ssh root@121.43.96.127 "echo OK"` |
| Service fails | Check logs (see above) |

## 📚 Library Functions

### Output
```bash
success "message"  # ✅ Green
error "message"    # ❌ Red
warn "message"     # ⚠️ Yellow
info "message"     # ℹ️ Blue
step "message"     # 🔹 Cyan
```

### Checks
```bash
check_command "java" "Install hint"
check_port 8080
kill_port 8080
```

### Git
```bash
check_git_status
git_commit_push "message"
```

### Build & Deploy
```bash
build_backend
deploy_to_server
```

## 🎯 Workflow Examples

### Daily Development
```bash
git pull
./go.sh 0
# Code...
# Test...
```

### Release to Production
```bash
./go.sh 0      # Test locally
./go.sh 1      # Deploy
# Enter message
# Confirm
```

### Quick Build Test
```bash
./go.sh 2
```

## 📁 Files

| File | Purpose |
|------|---------|
| `go.sh` | Main entry |
| `go.lib.sh` | Common library |
| `go.0.sh` | Local dev |
| `go.1.sh` | Deploy |
| `go.2.sh` | Build |
| `go.3.sh` | Clean |
| `.deployignore` | Exclude rules |

## 🔐 Security

- ✅ Use SSH keys
- ✅ Don't commit passwords
- ✅ Backup before deploy
- ✅ Test before production

## 📖 Documentation

- `GO脚本使用指南.md` - Chinese guide
- `GO_SCRIPT_README.md` - Technical docs
- `GO_SCRIPT_IMPROVEMENTS.md` - Improvements

---

**Quick Start**: `./go.sh` → Select option → Done! 🎉
