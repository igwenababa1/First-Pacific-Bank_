
import React, { useState, useMemo } from 'react';
import { CUSTOMER_REVIEWS, TOP_RATED_STAFF } from './constants';
import { StarIcon } from './Icons';

const StarRating: React.FC<{ rating: number; className?: string }> = ({ rating, className = 'w-5 h-5' }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <div key={i}>
                <StarIcon
                    className={`${className} ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-slate-600 dark:text-slate-700'}`}
                />
            </div>
        ))}
    </div>
);

export const Ratings: React.FC = () => {
    const overallSatisfaction = useMemo(() => {
        const totalRating = CUSTOMER_REVIEWS.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / CUSTOMER_REVIEWS.length).toFixed(1);
    }, []);

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h2 className="text-4xl font-extrabold text-slate-800">Customer Satisfaction</h2>
                <p className="text-lg text-slate-500 mt-2 max-w-2xl mx-auto">We're proud of our service, but we're even prouder of what our customers have to say.</p>
            </div>

            {/* Overall Score */}
            <div className="bg-slate-200 rounded-2xl shadow-digital p-8 text-center">
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Overall Satisfaction Score</p>
                <p className="text-7xl font-bold text-primary my-2">{overallSatisfaction}</p>
                <div className="flex justify-center">
                    <StarRating rating={Number(overallSatisfaction)} className="w-8 h-8" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Based on {CUSTOMER_REVIEWS.length} reviews</p>
            </div>

            {/* Customer Reviews */}
            <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6">What Our Customers Are Saying</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {CUSTOMER_REVIEWS.map(review => (
                        <div key={review.id} className="bg-slate-200 rounded-2xl shadow-digital p-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                                    {review.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{review.author}</p>
                                    <p className="text-xs text-slate-500">{review.location}</p>
                                </div>
                            </div>
                            <StarRating rating={review.rating} />
                            <p className="text-sm text-slate-600 mt-3 italic">"{review.comment}"</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Rated Staff */}
            <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Meet Our Top-Rated Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TOP_RATED_STAFF.map(staff => (
                        <div key={staff.id} className="bg-slate-200 rounded-2xl shadow-digital p-6 text-center">
                            <div className="relative inline-block mb-4">
                                <img src={staff.imageUrl} alt={staff.name} className="w-24 h-24 rounded-full object-cover shadow-lg" />
                                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                                    <StarIcon className="w-4 h-4 text-yellow-400" />
                                </div>
                            </div>
                            <h4 className="font-bold text-lg text-slate-800">{staff.name}</h4>
                            <p className="text-sm text-primary font-medium">{staff.title}</p>
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">{staff.bio}</p>
                            <div className="mt-4 flex justify-center items-center space-x-1 bg-white/50 rounded-full py-1 px-3 w-fit mx-auto">
                                <span className="font-bold text-slate-700">{staff.rating}</span>
                                <StarIcon className="w-4 h-4 text-yellow-400" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
