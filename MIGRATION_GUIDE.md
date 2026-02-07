# Migration Guide: Old go.sh → Enhanced go.sh

## 📋 Overview

This guide helps you transition from the original `go.sh` to the enhanced modular version based on ZERO framework.

## 🔄 Command Mapping

### Old → New

| Old Command | New Command | Notes |
|-------------|-------------|-------|
| `./go.sh build` or `./go.sh 1` | `./go.sh 2` | Build only |
| `./go.sh upload` or `./go.sh 2` | Integrated into `./go.sh 1` | Git commit |
| `./go.sh deploy` or `./go.sh 3` | Integrated into `./go.sh 1` | Server deploy |
| `./go.sh all` or `./go.sh 4` or `./go.sh` | `./go.sh 1` | Full workflow |
| N/A | `./go.sh 0` | **NEW**: Local dev |
| N/A | `./go.sh 3` | **NEW**: Clean cache |

## 📦 Migration Steps

### Step 1: Backup Old Script

```bash
# Backup the original go.sh
cp go.sh go.sh.backup

# Keep it for reference
```

### Step 2: Verify New Files

Check that these files exist:
```bash
ls -la go*.sh .deployignore
```

You should see:
- `go.sh` - Main entry
- `go.lib.sh` - Common library
- `go.0.sh` - Local dev
- `go.1.sh` - Deploy
- `go.2.sh` - Build
- `go.3.sh` - Clean
- `.deployignore` - Exclude rules

### Step 3: Set Permissions (Linux/Mac)

```bash
# Run setup script
bash setup-go-scripts.sh

# Or manually
chmod +x go*.sh
```

### Step 4: Test New Script

```bash
# Test interactive menu
./go.sh

# Test build
./go.sh 2

# Test local dev (new feature!)
./go.sh 0
```

### Step 5: Update Your Workflow

Update your deployment workflow:

**Old workflow**:
```bash
./go.sh all
# or
./go.sh 4
```

**New workflow**:
```bash
./go.sh 1
# or
./go.sh
# then select option 1
```

## 🆕 New Features to Try

### 1. Local Development Environment

**What it does**: Starts your backend locally for development

```bash
./go.sh 0
```

**Benefits**:
- Quick local testing
- No need to deploy for testing
- See logs in real-time

### 2. Clean Cache

**What it does**: Cleans build artifacts and temporary files

```bash
./go.sh 3
```

**When to use**:
- Build fails
- Disk space low
- Fresh start needed

### 3. Interactive Menu

**What it does**: Shows a friendly menu with all options

```bash
./go.sh
```

**Benefits**:
- No need to remember commands
- Clear descriptions
- Auto-timeout (10s)

### 4. Deployment Exclusion

**What it does**: `.deployignore` controls what gets deployed

**Benefits**:
- Faster deployments
- More secure (excludes sensitive files)
- Cleaner server

## 🔧 Configuration Changes

### Old Configuration

Configuration was scattered in functions:
```bash
# In local_build()
SERVER_HOST="121.43.96.127"
# In upload_to_github()
# In deploy_to_server()
```

### New Configuration

All configuration is centralized in `go.lib.sh`:
```bash
# Server configuration
SERVER_HOST="121.43.96.127"
SERVER_USER="root"
SERVER_PATH="/opt/easy-joy-life"
BACKEND_JAR="easy-joy-life-system-1.0.0.jar"
SITE_URL="https://xx.aieo.cn"
GIT_BRANCH="main"
```

**To update**: Edit `go.lib.sh` instead of `go.sh`

## 📝 Behavior Changes

### 1. Git Workflow

**Old**: Separate upload step
```bash
./go.sh upload
./go.sh deploy
```

**New**: Integrated workflow
```bash
./go.sh 1
# Prompts for commit message
# Confirms deployment
```

### 2. Build Process

**Old**: Always part of full deployment
```bash
./go.sh all  # Builds + uploads + deploys
```

**New**: Can build independently
```bash
./go.sh 2    # Just build
./go.sh 1    # Build + deploy
```

### 3. Error Handling

**Old**: `set -e` exits on any error

**New**: Graceful error handling with helpful messages
```bash
if [ $? -ne 0 ]; then
    error "Operation failed"
    info "Try: ./go.sh 3 to clean cache"
    exit 1
fi
```

## 🎯 Common Scenarios

### Scenario 1: Daily Development

**Old way**:
```bash
# No local dev option
# Had to deploy to test
./go.sh all
```

**New way**:
```bash
# Start local environment
./go.sh 0

# Develop and test locally
# Deploy when ready
./go.sh 1
```

### Scenario 2: Quick Build Test

**Old way**:
```bash
./go.sh build
# or
./go.sh 1
```

**New way**:
```bash
./go.sh 2
```

### Scenario 3: Production Deployment

**Old way**:
```bash
./go.sh all
# or
./go.sh 4
```

**New way**:
```bash
./go.sh 1
# Enter commit message when prompted
# Confirm deployment when asked
```

### Scenario 4: Fix Build Issues

**Old way**:
```bash
# Manually delete target/
rm -rf backend/target
./go.sh build
```

**New way**:
```bash
./go.sh 3  # Clean
./go.sh 2  # Rebuild
```

## 🐛 Troubleshooting Migration

### Issue 1: "go.lib.sh not found"

**Cause**: Missing library file

**Solution**:
```bash
# Ensure go.lib.sh exists
ls -la go.lib.sh

# If missing, re-download or recreate
```

### Issue 2: "Permission denied"

**Cause**: Scripts not executable

**Solution**:
```bash
# Run setup script
bash setup-go-scripts.sh

# Or manually
chmod +x go*.sh
```

### Issue 3: Old habits

**Cause**: Using old commands

**Solution**: Use this mapping:
```bash
# Old → New
./go.sh 1 → ./go.sh 2  (build)
./go.sh 2 → (part of ./go.sh 1)  (upload)
./go.sh 3 → (part of ./go.sh 1)  (deploy)
./go.sh 4 → ./go.sh 1  (all)
```

### Issue 4: Configuration not working

**Cause**: Editing wrong file

**Solution**:
```bash
# Don't edit go.sh
# Edit go.lib.sh instead
nano go.lib.sh
# Find configuration section
# Update values
```

## 📚 Learning Resources

### Quick Start
1. Read: `GO脚本使用指南.md` (Chinese)
2. Read: `GO_SCRIPT_README.md` (English)
3. Try: `./go.sh` (Interactive menu)

### Reference
- `GO_QUICK_REFERENCE.md` - Quick command reference
- `GO_SCRIPT_IMPROVEMENTS.md` - Detailed improvements

### Help
```bash
# Interactive menu shows all options
./go.sh

# Each script has comments
cat go.0.sh
cat go.1.sh
```

## ✅ Migration Checklist

- [ ] Backup old `go.sh`
- [ ] Verify new files exist
- [ ] Set execute permissions
- [ ] Test build: `./go.sh 2`
- [ ] Test local dev: `./go.sh 0`
- [ ] Update configuration in `go.lib.sh`
- [ ] Test deployment: `./go.sh 1`
- [ ] Update team documentation
- [ ] Update CI/CD scripts (if any)
- [ ] Remove old backup (after verification)

## 🎉 Benefits After Migration

### For Developers
- ✅ Local development environment
- ✅ Faster iteration (no deploy to test)
- ✅ Better error messages
- ✅ Cleaner cache management

### For Operations
- ✅ Modular, maintainable code
- ✅ Easy to extend
- ✅ Better deployment control
- ✅ Deployment exclusion rules

### For Team
- ✅ Consistent workflow
- ✅ Better documentation
- ✅ Easier onboarding
- ✅ Professional tooling

## 🚀 Next Steps

1. **Complete migration** using this guide
2. **Test all features** to ensure everything works
3. **Update team docs** with new commands
4. **Train team members** on new workflow
5. **Enjoy improved productivity**! 🎉

## 📞 Support

If you encounter issues:
1. Check this migration guide
2. Read `GO脚本使用指南.md`
3. Review error messages carefully
4. Check logs for details

---

**Remember**: The new system is more powerful and flexible. Take time to learn the new features - it's worth it! 💪
