import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  useWindowDimensions,
  Easing,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';

interface OnboardingSlide {
  id: string;
  image: any;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    image: require('../assets/img/slide1.png'),
    title: 'Tu bienestar es nuestra prioridad',
    description:
      'Estamos aquí para apoyarte en tu viaje como cuidador, enfocándonos en tu bienestar emocional y la salud cognitiva de tu ser querido.',
  },
  {
    id: '2',
    image: require('../assets/img/slide2.png'),
    title: 'Monitorea el progreso cognitivo de tus seres queridos',
    description:
      'Sigue los cambios cognitivos a lo largo del tiempo con nuestras herramientas fáciles de usar, garantizando apoyo y cuidado oportunos.',
  },
  {
    id: '3',
    image: require('../assets/img/slide3.png'),
    title: 'No estás solo, conéctate con otros cuidadores',
    description:
      'Únete a nuestra comunidad de cuidadores. Comparte experiencias, haz preguntas y encuentra apoyo en un espacio seguro y comprensivo.',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  // Usar useWindowDimensions para que se actualice dinámicamente
  const { width, height } = useWindowDimensions();

  // Calcular dimensiones dinámicamente
  const imageHeight = height * 0.48;
  const titleFontSize = width * 0.052;
  const descriptionFontSize = width * 0.035;
  const horizontalPadding = width * 0.08;
  const bottomPadding = height * 0.06;

  useEffect(() => {
    // Fade in al cargar
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const { width } = Dimensions.get('window');
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    // Animación del botón
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      // Transición suave al login
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/login');
      });
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <View style={[styles.imageContainer, { 
          width, 
          height: imageHeight,
          marginBottom: height * 0.03 
        }]}>
          <Image source={item.image} style={styles.image} resizeMode="cover" />
        </View>

        <View style={[styles.textContainer, { 
          paddingHorizontal: horizontalPadding,
          paddingTop: height * 0.02 
        }]}>
          <Text style={[styles.title, { 
            fontSize: titleFontSize,
            lineHeight: titleFontSize * 1.3,
            marginBottom: height * 0.015 
          }]}>{item.title}</Text>
          <Text style={[styles.description, { 
            fontSize: descriptionFontSize,
            lineHeight: descriptionFontSize * 1.6,
            paddingHorizontal: width * 0.02 
          }]}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar style="dark" />

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        {slides.map((item) => (
          <View key={item.id} style={[styles.slide, { width }]}>
            <View style={[styles.imageContainer, { 
              width, 
              height: imageHeight,
              marginBottom: height * 0.03 
            }]}>
              <Image source={item.image} style={styles.image} resizeMode="cover" />
            </View>

            <View style={[styles.textContainer, { 
              paddingHorizontal: horizontalPadding,
              paddingTop: height * 0.02 
            }]}>
              <Text style={[styles.title, { 
                fontSize: titleFontSize,
                lineHeight: titleFontSize * 1.3,
                marginBottom: height * 0.015 
              }]}>{item.title}</Text>
              <Text style={[styles.description, { 
                fontSize: descriptionFontSize,
                lineHeight: descriptionFontSize * 1.6,
                paddingHorizontal: width * 0.02 
              }]}>{item.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { 
        paddingHorizontal: horizontalPadding,
        paddingBottom: bottomPadding 
      }]}>
        {/* Pagination dots */}
        <View style={[styles.pagination, { marginBottom: height * 0.03 }]}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Next button con animación */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === slides.length - 1 ? 'Empezar' : 'Siguiente'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F0E8',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Poppins-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  footer: {},
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 30,
  },
  dotInactive: {
    backgroundColor: '#D1D5DB',
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.5,
  },
});
