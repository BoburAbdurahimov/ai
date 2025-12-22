# 3D Components Guide

Three.js and React Three Fiber components for stunning 3D visualizations.

---

## 📦 Components

### 1. BackupVisualization

Main 3D visualization showing backup system status.

**Features:**
- Central pulsating sphere (system status)
- Orbiting smaller spheres (individual backups)
- Animated stars background
- Auto-rotating camera
- Interactive orbit controls

**Usage:**
```tsx
import { BackupVisualization } from '@/components/3d/BackupVisualization';

<BackupVisualization 
  backupCount={5} 
  systemStatus="healthy" 
/>
```

**Props:**
- `backupCount` - Number of backup orbs to display (1-8)
- `systemStatus` - 'healthy' | 'warning' | 'error'
- `className` - Optional CSS classes

### 2. BackupSphere

Individual 3D sphere representing a backup or system component.

**Features:**
- Distorted mesh material
- Color-coded status
- Hover effects
- Smooth rotation animation
- Pulse on hover

**Usage:**
```tsx
import { BackupSphere } from '@/components/3d/BackupSphere';

<Canvas>
  <BackupSphere 
    position={[0, 0, 0]} 
    status="healthy" 
    scale={1}
  />
</Canvas>
```

### 3. StatusGlobe

3D globe visualization for system health.

**Features:**
- Rotating globe
- Glowing ring
- Particle sparkles
- Pulsing animation
- Status-based colors

**Usage:**
```tsx
import { StatusGlobe } from '@/components/3d/StatusGlobe';

<Canvas>
  <StatusGlobe status="healthy" size={1.5} />
</Canvas>
```

### 4. AnimatedBackground

Particle field background animation.

**Features:**
- 5000 animated particles
- Subtle rotation
- Low opacity for subtle effect
- Fixed position (doesn't scroll)

**Usage:**
```tsx
import { AnimatedBackground } from '@/components/3d/AnimatedBackground';

<AnimatedBackground />
```

### 5. DataCubes

3D bar chart visualization with floating cubes.

**Features:**
- Height based on data value
- Floating animation
- 3D text labels
- Color-coded categories

**Usage:**
```tsx
import { DataCubesVisualization } from '@/components/3d/DataCubes';

<Canvas>
  <DataCubesVisualization 
    data={[
      { label: 'Backups', value: 150, color: '#10b981' },
      { label: 'Records', value: 1247, color: '#3b82f6' }
    ]}
  />
</Canvas>
```

---

## 🎨 Color Scheme

### Status Colors
```typescript
{
  healthy: '#10b981',  // Green
  warning: '#f59e0b',  // Yellow/Orange
  error: '#ef4444'     // Red
}
```

### Component Colors
```typescript
{
  primary: '#4f46e5',   // Indigo
  secondary: '#8b5cf6', // Purple
  accent: '#06b6d4'     // Cyan
}
```

---

## ⚡ Performance

### Optimization Tips

1. **Use dynamic imports** (already implemented):
```tsx
const BackupVisualization = dynamic(
  () => import('@/components/3d/BackupVisualization'),
  { ssr: false }
);
```

2. **Limit particle count** for mobile:
```tsx
const isMobile = window.innerWidth < 768;
<Points positions={positions} count={isMobile ? 1000 : 5000} />
```

3. **Disable auto-rotate** on low-end devices:
```tsx
<OrbitControls autoRotate={!isMobile} />
```

4. **Use Suspense** for loading states:
```tsx
<Suspense fallback={<Loader />}>
  <BackupVisualization />
</Suspense>
```

---

## 🎮 Interactions

### Mouse Controls
- **Left Click + Drag** - Rotate camera
- **Right Click + Drag** - Pan camera (if enabled)
- **Scroll Wheel** - Zoom (if enabled)
- **Hover** - Sphere pulse effect

### Touch Controls
- **One Finger** - Rotate
- **Two Fingers** - Zoom/Pan
- **Pinch** - Zoom

---

## 🎭 Animations

### Built-in Animations

1. **Rotation**
```tsx
useFrame((state, delta) => {
  mesh.rotation.y += delta * 0.5;
});
```

2. **Floating**
```tsx
<Float speed={2} rotationIntensity={0.5}>
  <BackupSphere />
</Float>
```

3. **Pulsing**
```tsx
const scale = 1 + Math.sin(time * 2) * 0.05;
mesh.scale.setScalar(scale);
```

4. **Wave Motion**
```tsx
mesh.position.y = Math.sin(time + offset) * 0.1;
```

---

## 🔧 Customization

### Change Sphere Material

```tsx
<meshStandardMaterial
  color="#10b981"
  emissive="#10b981"
  emissiveIntensity={0.5}
  roughness={0.2}
  metalness={0.8}
/>
```

### Add More Lights

```tsx
<Canvas>
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} />
  <spotLight position={[0, 10, 0]} angle={0.3} />
</Canvas>
```

### Modify Camera

```tsx
<PerspectiveCamera 
  makeDefault 
  position={[0, 0, 5]}
  fov={75}
  near={0.1}
  far={1000}
/>
```

---

## 📐 Scene Setup

### Basic Scene Template

```tsx
<Canvas>
  {/* Camera */}
  <PerspectiveCamera makeDefault position={[0, 0, 5]} />
  
  {/* Lighting */}
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} />
  
  {/* Objects */}
  <BackupSphere position={[0, 0, 0]} />
  
  {/* Controls */}
  <OrbitControls />
</Canvas>
```

---

## 🐛 Troubleshooting

### Issue: Black screen / Nothing renders

**Solution:**
1. Check console for Three.js errors
2. Ensure dynamic import with `ssr: false`
3. Verify camera position is not inside object
4. Add lighting to scene

### Issue: Poor performance

**Solution:**
1. Reduce particle count
2. Lower geometry segments (e.g., `<Sphere args={[1, 32, 32]}>`)
3. Disable shadows if not needed
4. Use `frustumCulled={false}` sparingly

### Issue: Controls not working

**Solution:**
1. Ensure `<OrbitControls />` is inside `<Canvas>`
2. Check if `enableZoom` or `enableRotate` is disabled
3. Verify no conflicting event handlers

---

## 🎓 Learning Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Docs](https://threejs.org/docs/)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [Three.js Examples](https://threejs.org/examples/)

---

## 💡 Ideas for More Visualizations

1. **Network Graph** - Show backup relationships
2. **Timeline** - 3D timeline of backup history
3. **Heatmap** - Backup frequency visualization
4. **Particle System** - Restore progress particles
5. **Holographic UI** - Futuristic status panels

---

Built with Three.js and React Three Fiber ✨
