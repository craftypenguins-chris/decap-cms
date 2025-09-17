# Local Preview Mirror Implementation

## Overview
This implementation adds a "local preview mirror" feature to Decap CMS that allows real-time synchronization of content to a local Hugo server while maintaining the editorial workflow in GitHub/git-gateway.

## How It Works
When you save content in the CMS editor:
1. The content is saved to GitHub as usual (creating/updating PR in editorial workflow)
2. **In parallel**, the same content is mirrored to your local filesystem via the decap-server
3. Hugo detects the file changes and auto-rebuilds
4. The preview iframe shows the updated Hugo page immediately

## Configuration

Add the following to your `config.yml`:

```yaml
backend:
  name: git-gateway  # or github
  branch: main

publish_mode: editorial_workflow

# NEW: Enable local preview mirroring
local_preview_mirror:
  url: http://localhost:8081/api/v1  # URL of your decap-server
  allowed_hosts:  # Hosts allowed to use the mirror
    - localhost
    - 127.0.0.1
    - cms.craftypenguins.net
    # Add your custom domains here

media_folder: static/images
public_folder: /images
```

## Setup Steps

1. **Start the decap-server** in your Hugo project directory:
   ```bash
   npx decap-server
   # or for git mode:
   # MODE=git npx decap-server
   ```

2. **Start Hugo with draft building**:
   ```bash
   hugo server --buildDrafts --navigateToChanged
   ```

3. **Access the CMS** and start editing:
   - The CMS will detect the mirror proxy automatically
   - A status indicator appears in the header showing mirror connectivity
   - Toast notifications appear when content is synced

## Features Implemented

### 1. Configuration Schema
- Added `local_preview_mirror` config option with URL and allowed hosts
- TypeScript types and validation added

### 2. Backend Extensions
- **git-gateway backend**: Added mirror methods to sync with local proxy
- **GitHub backend**: Also has mirror support (if using GitHub directly)
- Non-blocking parallel writes to avoid slowing down the main save operation

### 3. UI Components
- **Mirror Status Indicator**: Shows connection status in the header
- **Toast Notifications**: Displays success/error messages for mirror operations
- **Redux Store**: Tracks mirror connection state

### 4. Mirror Operations
- `mirrorPersistEntry`: Mirrors content saves to local filesystem
- `mirrorPersistMedia`: Mirrors media uploads to local filesystem
- Forces `useWorkflow: false` for local writes so files appear immediately

## Technical Details

### Files Modified

**Core Configuration:**
- `/packages/decap-cms-core/src/constants/configSchema.js` - Added schema validation
- `/packages/decap-cms-core/src/types/redux.ts` - Added TypeScript types
- `/packages/decap-cms-core/index.d.ts` - Public type definitions
- `/packages/decap-cms-core/src/actions/config.ts` - Mirror detection logic

**Backend Implementation:**
- `/packages/decap-cms-backend-git-gateway/src/implementation.ts` - Main implementation
- `/packages/decap-cms-backend-github/src/implementation.tsx` - GitHub backend support

**UI Components:**
- `/packages/decap-cms-core/src/components/UI/MirrorStatusIndicator.tsx` - Status indicator
- `/packages/decap-cms-core/src/components/App/Header.js` - Header integration
- `/packages/decap-cms-core/src/reducers/mirrorStatus.ts` - Redux state

## How Mirror Writes Work

1. When `persistEntry` is called in the git-gateway backend:
   - Main save proceeds to GitHub/GitLab/Bitbucket
   - Mirror save happens in parallel to local proxy
   
2. The mirror request:
   - Serializes assets to base64
   - Sets `useWorkflow: false` to write directly to disk
   - Posts to the proxy server endpoint
   
3. The decap-server receives the request and:
   - Writes markdown files to the repo directory
   - Writes media files to the configured media folder
   - Hugo detects changes and rebuilds

## Benefits

- **Instant Preview**: See changes immediately in Hugo without waiting for GitHub
- **Editorial Workflow Preserved**: GitHub PR workflow continues as normal
- **Non-blocking**: Mirror failures don't affect the main save operation
- **Media Support**: Images and other assets are mirrored too
- **Status Visibility**: Clear indicators show mirror connectivity

## Troubleshooting

1. **Mirror not connecting**: 
   - Check that decap-server is running
   - Verify the URL in `local_preview_mirror.url`
   - Ensure your hostname is in `allowed_hosts`

2. **Files not appearing locally**:
   - Check decap-server logs for errors
   - Verify the server is running in the correct directory
   - For git mode, ensure you're on the right branch

3. **CORS issues**:
   - The decap-server has permissive CORS by default
   - If needed, modify `/packages/decap-server/src/middlewares/common/index.ts`

## Future Enhancements

- Add configuration for different local branches
- Support for syncing deletions
- Batch operations for better performance
- Configurable retry logic for failed mirror operations
