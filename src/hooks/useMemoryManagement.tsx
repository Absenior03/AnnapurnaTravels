import { useEffect, useState, useCallback } from 'react';

interface MemoryInfo {
  totalJSHeapSize?: number;
  usedJSHeapSize?: number;
  jsHeapSizeLimit?: number;
}

interface MemoryState {
  isLowMemoryDevice: boolean;
  memoryUsage: number | null;
  shouldReduceQuality: boolean;
}

/**
 * Custom hook to monitor memory usage and provide memory management optimizations
 */
export function useMemoryManagement(threshold = 70): MemoryState & { 
  startMonitoring: () => void;
  stopMonitoring: () => void;
  cleanupResources: () => void;
} {
  const [memoryState, setMemoryState] = useState<MemoryState>({
    isLowMemoryDevice: false,
    memoryUsage: null,
    shouldReduceQuality: false
  });
  
  const [monitoringActive, setMonitoringActive] = useState(false);
  
  // Check device capabilities
  useEffect(() => {
    // Detect if this is likely a low memory device
    const detectLowMemoryDevice = () => {
      // Check if running on a mobile device
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      // Check if small screen (likely a mobile device)
      const isSmallScreen = window.innerWidth < 768;
      
      // Check if memory API is available and has limited memory
      let hasLimitedMemory = false;
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory as MemoryInfo;
        if (memoryInfo && memoryInfo.jsHeapSizeLimit) {
          // Less than 2GB is considered limited for 3D applications
          hasLimitedMemory = memoryInfo.jsHeapSizeLimit < 2 * 1024 * 1024 * 1024;
        }
      }
      
      // Check if the device has a low-end GPU
      let hasLowEndGPU = false;
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          // List of known mobile or low-end GPU identifiers
          const lowEndGPUs = [
            'intel', 'hd graphics', 'mesa', 'llvmpipe', 'swiftshader', 
            'mali', 'adreno', 'powervr', 'apple a7', 'apple a8', 'apple a9'
          ];
          
          hasLowEndGPU = lowEndGPUs.some(gpu => 
            renderer.toLowerCase().includes(gpu)
          );
        }
      }
      
      // Determine if this is a low memory device
      return isMobileDevice || isSmallScreen || hasLimitedMemory || hasLowEndGPU;
    };
    
    setMemoryState(prev => ({
      ...prev,
      isLowMemoryDevice: detectLowMemoryDevice()
    }));
  }, []);
  
  // Memory usage monitoring
  const checkMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory as MemoryInfo;
      
      if (memoryInfo && memoryInfo.usedJSHeapSize && memoryInfo.jsHeapSizeLimit) {
        const usage = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
        
        setMemoryState(prev => ({
          ...prev,
          memoryUsage: usage,
          shouldReduceQuality: usage > threshold
        }));
        
        // If memory usage exceeds the threshold, dispatch a warning event
        if (usage > threshold) {
          const memoryWarningEvent = new CustomEvent('memory-warning', {
            detail: {
              usage,
              usedJSHeapSize: memoryInfo.usedJSHeapSize,
              jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit
            }
          });
          window.dispatchEvent(memoryWarningEvent);
        }
        
        return usage;
      }
    }
    
    return null;
  }, [threshold]);
  
  // Start/stop monitoring functions
  const startMonitoring = useCallback(() => {
    setMonitoringActive(true);
  }, []);
  
  const stopMonitoring = useCallback(() => {
    setMonitoringActive(false);
  }, []);
  
  // Cleanup function
  const cleanupResources = useCallback(() => {
    // Try to force garbage collection if available
    if (typeof window !== 'undefined' && 'gc' in window) {
      try {
        (window as any).gc();
      } catch (e) {
        console.log('Manual garbage collection not available');
      }
    }
    
    // Attempt to free up texture memory by resetting variables
    const resetCanvases = document.querySelectorAll('canvas');
    resetCanvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      if (gl) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    });
    
    console.log('Resources cleaned up');
  }, []);
  
  // Set up memory monitoring interval
  useEffect(() => {
    let monitorInterval: NodeJS.Timeout | null = null;
    
    if (monitoringActive) {
      // Check memory every 30 seconds
      monitorInterval = setInterval(() => {
        checkMemoryUsage();
      }, 30000); // 30 seconds
      
      // Initial check
      checkMemoryUsage();
    }
    
    return () => {
      if (monitorInterval) {
        clearInterval(monitorInterval);
      }
    };
  }, [monitoringActive, checkMemoryUsage]);
  
  return {
    ...memoryState,
    startMonitoring,
    stopMonitoring,
    cleanupResources
  };
}

export default useMemoryManagement; 