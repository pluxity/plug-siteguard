import { create } from 'zustand'
import {
  Viewer as CesiumViewer,
  Cartesian3,
  Cartesian2,
  Entity,
  HeightReference,
  NearFarScalar,
  Color,
  LabelStyle,
  VerticalOrigin,
  ConstantPositionProperty,
  ConstantProperty,
  Event,
  CustomDataSource,
} from 'cesium'
import type { FeatureOptions } from './types'

const blinkListeners = new Map<string, Event.RemoveCallback>()

const DEFAULT_FEATURE_CONFIG = {
  width: 32,
  height: 32,
  heightOffset: 1,
  labelFont: 'bold 13px SUIT',
  labelFillColor: Color.BLACK, // 검은색 글씨
  labelOutlineColor: Color.WHITE, // 흰 색 테두리
  labelOutlineWidth: 3, // 테두리 두께
  labelPixelOffsetY: -26,
  scaleNear: { distance: 100, scale: 1.5 },
  scaleFar: { distance: 5000, scale: 0.3 },
} as const

const BLINK_CONFIG = {
  defaultDuration: 1000,
  alphaMin: 0.3,
  alphaMax: 1.0,
} as const

const HOVER_CONFIG = {
  // 빌보드(마커 이미지) 확대
  billboardScaleMultiplier: 1.3,
  // 라벨 확대
  labelScaleMultiplier: 1.15,
  // 라벨 스타일
  labelFont: 'bold 14px SUIT',
  labelFillColor: Color.BLACK, // 검은색 글씨
  labelOutlineColor: Color.WHITE, // 흰색 테두리
  labelOutlineWidth: 3, // 테두리 두께
} as const

interface FeatureState {
  hoveredFeatureId: string | null
}

interface FeatureActions {
  addFeature: (viewer: CesiumViewer, options: FeatureOptions) => Entity
  removeFeature: (viewer: CesiumViewer, id: string) => void
  updateFeature: (viewer: CesiumViewer, id: string, options: Partial<FeatureOptions>) => void
  clearAllFeatures: (viewer: CesiumViewer) => void
  startFeatureBlink: (viewer: CesiumViewer, featureId: string, duration?: number) => void
  stopFeatureBlink: (viewer: CesiumViewer, featureId: string) => void
  setFeatureHover: (viewer: CesiumViewer, featureId: string | null, dataSource?: CustomDataSource) => void
}

type FeatureStore = FeatureState & FeatureActions

export const useFeatureStore = create<FeatureStore>((set, get) => ({
  hoveredFeatureId: null,

  addFeature: (viewer: CesiumViewer, options: FeatureOptions) => {
    const position = Cartesian3.fromDegrees(
      options.lon,
      options.lat,
      options.height ?? DEFAULT_FEATURE_CONFIG.heightOffset
    )

    const featureHeight = options.heightValue || DEFAULT_FEATURE_CONFIG.height

    const scaleByDistance = options.disableScaleByDistance || options.dataSource
      ? undefined
      : new NearFarScalar(
          DEFAULT_FEATURE_CONFIG.scaleNear.distance,
          DEFAULT_FEATURE_CONFIG.scaleNear.scale,
          DEFAULT_FEATURE_CONFIG.scaleFar.distance,
          DEFAULT_FEATURE_CONFIG.scaleFar.scale
        )

    const labelPixelOffset = options.label
      ? new Cartesian2(0, -(featureHeight / 2 + 10))
      : undefined

    // dataSource가 있으면 dataSource.entities에 추가, 없으면 viewer.entities에 추가
    const targetEntities = options.dataSource
      ? options.dataSource.entities
      : viewer.entities

    const entity = targetEntities.add({
      id: options.id,
      position: position,
      billboard: {
        image: options.image || '/assets/icons/feature.png',
        width: options.width || 32,
        height: options.heightValue || 32,
        heightReference: options.heightReference ?? HeightReference.RELATIVE_TO_GROUND,
        scaleByDistance: scaleByDistance,
        verticalOrigin: VerticalOrigin.BOTTOM,
        disableDepthTestDistance: options.disableDepthTest ? Number.POSITIVE_INFINITY : undefined,
      },
      label: options.label
        ? {
            text: options.label,
            font: DEFAULT_FEATURE_CONFIG.labelFont,
            fillColor: DEFAULT_FEATURE_CONFIG.labelFillColor,
            outlineColor: DEFAULT_FEATURE_CONFIG.labelOutlineColor,
            outlineWidth: DEFAULT_FEATURE_CONFIG.labelOutlineWidth,
            showBackground: false, // 배경 제거
            style: LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: VerticalOrigin.BOTTOM,
            pixelOffset: labelPixelOffset,
            heightReference: options.heightReference,
            show: false,
            disableDepthTestDistance: options.disableDepthTest ? Number.POSITIVE_INFINITY : undefined,
          }
        : undefined,
    })

    viewer.scene.requestRender()

    return entity
  },

  removeFeature: (viewer: CesiumViewer, id: string, dataSource?: CustomDataSource) => {
    const targetEntities = dataSource ? dataSource.entities : viewer.entities;
    const entity = targetEntities.getById(id);
    if (entity) {
      targetEntities.remove(entity);
      viewer.scene.requestRender();
    }
  },

  updateFeature: (viewer: CesiumViewer, id: string, options: Partial<FeatureOptions>) => {
    const entity = viewer.entities.getById(id)
    if (!entity) return

    if (options.lon !== undefined && options.lat !== undefined) {
      const position = Cartesian3.fromDegrees(
        options.lon,
        options.lat,
        options.height ?? 0
      )
      entity.position = new ConstantPositionProperty(position)
    }

    if (options.label !== undefined && entity.label) {
      entity.label.text = new ConstantProperty(options.label)
    }

    if (options.labelColor !== undefined && entity.label) {
      entity.label.fillColor = new ConstantProperty(
        Color.fromCssColorString(options.labelColor)
      )
    }

    viewer.scene.requestRender()
  },

  clearAllFeatures: (viewer: CesiumViewer) => {
    blinkListeners.forEach((removeCallback) => removeCallback())
    blinkListeners.clear()
    viewer.entities.removeAll()
    viewer.scene.requestRender()
  },

  startFeatureBlink: (viewer: CesiumViewer, featureId: string, duration: number = BLINK_CONFIG.defaultDuration) => {
    const entity = viewer.entities.getById(featureId)
    if (!entity || !entity.billboard) return

    const existingListener = blinkListeners.get(featureId)
    if (existingListener) {
      existingListener()
      blinkListeners.delete(featureId)
    }

    const startTime = Date.now()

    const removeCallback = viewer.clock.onTick.addEventListener(() => {
      if (viewer.isDestroyed() || !entity.billboard) return

      const elapsed = Date.now() - startTime
      const progress = (elapsed % duration) / duration
      const sinValue = Math.sin(progress * Math.PI * 2)
      const alphaRange = BLINK_CONFIG.alphaMax - BLINK_CONFIG.alphaMin
      const alpha = BLINK_CONFIG.alphaMin + (sinValue + 1) / 2 * alphaRange

      entity.billboard.color = new ConstantProperty(Color.WHITE.withAlpha(alpha))
      viewer.scene.requestRender()
    })

    blinkListeners.set(featureId, removeCallback)
  },

  stopFeatureBlink: (viewer: CesiumViewer, featureId: string) => {
    const removeCallback = blinkListeners.get(featureId)
    if (!removeCallback) return

    removeCallback()
    blinkListeners.delete(featureId)

    const entity = viewer.entities.getById(featureId)
    if (entity && entity.billboard) {
      entity.billboard.color = new ConstantProperty(Color.WHITE)
      viewer.scene.requestRender()
    }
  },

  setFeatureHover: (viewer: CesiumViewer, featureId: string | null, dataSource?: CustomDataSource) => {
    const { hoveredFeatureId } = get()
    const targetEntities = dataSource ? dataSource.entities : viewer.entities

    // 이전 호버 피처 복원 (기본 상태로)
    if (hoveredFeatureId && hoveredFeatureId !== featureId) {
      const prevEntity = targetEntities.getById(hoveredFeatureId)
      if (prevEntity) {
        // 빌보드(피처 이미지) 원래 크기로 복원
        if (prevEntity.billboard) {
          prevEntity.billboard.scale = new ConstantProperty(1.0)
        }
        // 라벨 숨김
        if (prevEntity.label) {
          prevEntity.label.show = new ConstantProperty(false)
          prevEntity.label.scale = new ConstantProperty(1.0)
          prevEntity.label.font = new ConstantProperty(DEFAULT_FEATURE_CONFIG.labelFont)
        }
      }
    }

    // 새로운 호버 피처 강조
    if (featureId) {
      const entity = targetEntities.getById(featureId)
      if (entity) {
        // 빌보드(피처 이미지) 확대
        if (entity.billboard) {
          entity.billboard.scale = new ConstantProperty(HOVER_CONFIG.billboardScaleMultiplier)
        }
        // 라벨 표시 및 확대, 스타일 변경
        if (entity.label) {
          entity.label.show = new ConstantProperty(true)
          entity.label.scale = new ConstantProperty(HOVER_CONFIG.labelScaleMultiplier)
          entity.label.font = new ConstantProperty(HOVER_CONFIG.labelFont)
        }
      }
    }

    set({ hoveredFeatureId: featureId })
    viewer.scene.requestRender()
  },
}))
