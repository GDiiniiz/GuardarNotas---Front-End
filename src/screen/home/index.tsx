import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { api } from '~/services/api';

interface inputProps {
  grade: string;
}

interface myGradesProps {
  id: string;
  grade: string;
  created_At: string;
}

export function Home() {
  const [myGrades, setMyGrades] = useState<myGradesProps[]>([]);
  const [edit, setEdit] = useState(false);
  const { control, handleSubmit, watch, reset } = useForm<inputProps>();

  const gradesText = watch('grade');

  const renderMyGrades = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        style={{
          backgroundColor: '#27272C',
          marginHorizontal: 16,
          marginBottom: 8,
          padding: 16,
        }}>
        <View>
          <Text style={{ color: '#f4f4f4', fontSize: 16, fontWeight: 'bold' }}>{item?.grade}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: 4,
            gap: 20,
          }}>
          {/* <TouchableOpacity
            onPress={() => buttonEdit(item?.id)}
            style={{
              backgroundColor: '#1D1D20',
              width: 81,
              height: 34,
              borderRadius: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ color: '#BBBBBC', fontSize: 16, fontWeight: 'bold' }}>Editar</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => deleteGrade(item?.id)}
            style={{
              backgroundColor: '#1D1D20',
              width: 81,
              height: 34,
              borderRadius: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ color: '#BBBBBC', fontSize: 16, fontWeight: 'bold' }}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  function buttonEdit(id: number) {
    setEdit(true);
  }

  async function getGrades() {
    try {
      const response = await api.get('/grades');
      setMyGrades(response?.data);
    } catch (err) {
      console.error('Erro ao obter as notas:', err);
    }
  }

  async function onSubmit(data: inputProps) {
    try {
      const requestData = {
        ...data,
      };
      await api.post('/grades', requestData);

      reset();
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteGrade(id: number) {
    try {
      await api.delete(`/grades/${id}`);
    } catch (err) {
      console.log(err);
    }
  }

  async function editGrade(id?: number, data?: inputProps) {
    setEdit(false);
    const requestData = {
      ...data,
    };
    try {
      const response = await api.put(`/grades/${id}`, requestData);
      console.log(response);
      reset();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getGrades();
  }, [deleteGrade, onSubmit]);

  return (
    <View style={{ backgroundColor: '#1D1D20', flex: 1 }}>
      <SafeAreaView>
        <View style={{ paddingHorizontal: 16, alignItems: 'center', marginTop: 32 }}>
          <Text style={{ color: '#6366F1', textAlign: 'center' }}>
            SALVE SUAS IDEIAS COM NOTAS ONLINE
          </Text>
          <Text
            style={{
              color: '#f4f4f4',
              fontSize: 40,
              textTransform: 'uppercase',
              fontWeight: '800',
            }}>
            guardanotas ✍️
          </Text>
        </View>

        <View style={{ marginTop: 32 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder="Escreva uma nota"
                placeholderTextColor="#71717A"
                multiline
                maxLength={200}
                style={{
                  backgroundColor: '#27272C',
                  padding: 8,
                  marginHorizontal: 16,
                  color: '#f4f4f4',
                  borderRadius: 3,
                  minHeight: 38,
                  borderWidth: 1,
                  borderColor: '#71717A',
                }}
              />
            )}
            name="grade"
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingHorizontal: 16,
              paddingVertical: 16,
              gap: 20,
            }}>
            <Text style={{ color: '#9CA3AF', fontSize: 16 }}> {gradesText?.length || 0}/200</Text>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={{
                backgroundColor: '#6366F1',
                width: 111,
                height: 38,
                borderRadius: 3,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: '#ffff', fontWeight: 'bold', fontSize: 16 }}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList data={myGrades} renderItem={renderMyGrades} keyExtractor={(item) => item?.id} />
      </SafeAreaView>
    </View>
  );
}
