'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAuth } from '@/lib/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FileText, Download, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {  Inter } from 'next/font/google';
import DotPattern from '../ui/dot-pattern';

const inter = Inter({ subsets: ['latin'] });

interface StudyMaterial {
  id: string;
  title: string;
  createdAt: Date;
  fileUrl: string;
}

const StudyMaterialsComponent: React.FC = () => {
  const { user } = useAuth();
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchStudyMaterials = async () => {
      if (user) {
        const studyMaterialsRef = collection(db, 'study_materials');
        const q = query(studyMaterialsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const materials: StudyMaterial[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          materials.push({
            id: doc.id,
            title: data.title,
            createdAt: data.createdAt.toDate(),
            fileUrl: data.fileUrl
          } as StudyMaterial);
        });
        setStudyMaterials(materials);
        setLoading(false);
      }
    };

    fetchStudyMaterials();
  }, [user]);

  const handleDownload = (fileUrl: string, fileName: string) => {
    // Implement file download logic here
    console.log(`Downloading ${fileName} from ${fileUrl}`);
    // You might want to use the `window.open(fileUrl, '_blank')` method for actual download
  };

  const handleAddNewMaterial = () => {
    // Navigate to the dashboard when adding new material
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`${inter.className} relative min-h-full bg-gray-50 overflow-hidden`}>
      <div className="absolute inset-0 z-0">
        <DotPattern
          width={22}
          height={22}
          cx={2}
          cy={2}
          cr={1}
          className="text-gray-200"
        />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        {studyMaterials.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-6">You have not uploaded any study materials yet.</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddNewMaterial}>
              <Plus className="mr-2" size={16} />
              Upload Your First Material
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyMaterials.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <FileText className="mr-3 text-blue-600" size={24} />
                    <h3 className="font-semibold text-lg">{material.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Created on: {material.createdAt.toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                    onClick={() => handleDownload(material.fileUrl, material.title)}
                  >
                    <Download className="mr-2" size={16} />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {studyMaterials.length > 0 && (
          <div className="mt-10 text-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddNewMaterial}>
              <Plus className="mr-2" size={16} />
              Add New Study Material
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterialsComponent;